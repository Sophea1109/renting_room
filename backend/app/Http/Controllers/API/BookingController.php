<?php

namespace App\Http\Controllers\API;

use App\Events\BookingStatusUpdate;
use App\Http\Controllers\Controller;
use App\Models\Unit;
use Illuminate\Http\Request;
use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Services\TelegramService;

class BookingController extends Controller
{
    public function __construct(private TelegramService $telegram){
        
    }

    // check availability of unit for given date range
    // price calculate in store so tenant can see the price calculation before submitting
    // the booking, better user experience
    public function store(Request $request){
        $validated = $request->validate([
            'unit_id' => 'required|exists:units,id',
            'start_date'   => 'required|date|after_or_equal:today',
            'end_date'     => 'required|date|after:start_date',
            'payment_type' => 'required|in:pay_now,pay_later',
        ]);
        $validated['user_id'] = Auth::id();

        $unit = Unit::findOrFail($validated['unit_id']);
        if ($unit->status === 'unavailable') {
            return response()->json([
                'message' => 'This room is currently not available!',
            ], 422);
        }

        // prevent duplicate booking
        $alreadyApproved = Booking::where('unit_id', $unit->id)
            ->where('status', 'approved')
            ->where('start_date', '<', $validated['end_date'])
            ->where('end_date', '>', $validated['start_date'])
            ->exists();
        if ($alreadyApproved){
            return response()->json([
                'message' => 'This room has already been approved by the owner',
            ], 422);
        }

        // current pending booking, can't sumbit while pending
        $ongoingPending = Booking::where('unit_id', $unit->id)
            ->where('status', 'pending')
            ->where('start_date', '<', $validated['end_date'])
            ->where('end_date', '>', $validated['start_date'])
            ->exists();
        if ($ongoingPending){
            return response()->json([
                'message' => 'This room have an ongoing pending booking.',
            ], 422);
        }

        // calculating the date of the room to show tenant how much the room will be
        $days = Carbon::parse($validated['start_date'])->diffInDays(Carbon::parse($validated['end_date']));
        if($unit->price_type === 'day'){
            $totalAmount = $days * $unit->price;
        } elseif ($unit->price_type === 'month'){
            $totalAmount = ($days / 30) * $unit->price;
        } else {
            $totalAmount = ($days / 365) * $unit->price;
        }

        if($validated['payment_type'] === 'pay_later'){
            $contractPaylater = "Tenant agrees to pay {$totalAmount} THB upon check-in on {$validated['start_date']}";
        } else{
            $contractPaylater = null;
        }

        $booking = Booking::create([
            'unit_id' => $validated['unit_id'],
            'user_id' => $validated['user_id'],
            'status' => 'pending',
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'total_price' => $totalAmount,
            'payment_type' => $validated['payment_type'],
            'contract_paylater' => $contractPaylater,
        ]);

        broadcast(new BookingStatusUpdate($booking))->toOthers();
        $this->telegram->sendToUser($booking->unit->user_id, "New booking {$booking->booking_ref} for your unit.");

        return response()->json([
            'message' => 'Booking submitted successfully!',
            'booking' => $booking
        ], 201);
    }

    // listing all the booking request for owner
    public function index (Request $request){
        $userId = Auth::id();
        $status = $request->query('status');

        $query = Booking::with('unit')
            ->where('user_id', $userId)
            ->orderByRaw("FIELD(status, 'pending', 'approved', 'rejected', 'completed', 'cancelled')")
            ->orderBy('created_at', 'desc');
        if ($status && in_array($status, ['pending', 'approved', 'rejected', 'completed', 'cancelled'])) {
            $query->where('status', $status);
        }

        //display for frontend
        $bookings = $query->get()->map(function ($booking){
            return [
                'id' => $booking->id,
                'booking_ref' => $booking->booking_ref,
                'user_id' => $booking->user_id,
                'unit_id' => $booking->unit_id,
                'start_date' => $booking->start_date,
                'end_date' => $booking->end_date,
                'total_price' => $booking->total_price,
                'status' => $booking->status,
                'payment_type' => $booking->payment_type,
            ];
        });
        $pendingCount = Booking::where('user_id', $userId)->where('status', 'pending')->count();
        $approvedCount = Booking::where('user_id', $userId)->where('status', 'approved')->count();
        $rejectedCount = Booking::where('user_id', $userId)->where('status', 'rejected')->count();
        $completedCount = Booking::where('user_id', $userId)->where('status', 'completed')->count();
        $cancelledCount = Booking::where('user_id', $userId)->where('status', 'cancelled')->count();

        return response()->json([
            'bookings' => $bookings,
            'count' => [
                'all' => $bookings->count(),
                'pending' => $pendingCount,
                'approved' => $approvedCount,                    
                'rejected' => $rejectedCount,
                'completed' => $completedCount,
                'cancelled' => $cancelledCount
            ],
        ]);
    }

    // show single booking details
    public function show(Booking $booking){
        $user = Auth::user();
        $query = Booking::query();
        if ($user->role === 'owner'){
            return response()->json([
                'bookings' => $query->whereHas('unit', function($q) use ($user) {
                $q->where('user_id', $user->id);
                })->get()
            ]);
        } elseif($user->role === 'admin'){
            return response()->json([
                'bookings' => Booking::with('unit')->get()
            ]);
        } else{
            return response()->json([
                'message' => 'user cannot view booking, return.',
            ], 403);
        }
    }
    
    public function approved(Booking $booking){
        $user = Auth::user();
        if($user->role === 'owner' && $booking->unit->user_id === $user->id){
            if ($booking->status !== 'pending'){
                return response()->json([
                'message' => 'only pending booking can be approved'
                ], 422);
            }
            $booking->update([
                'status' => 'approved', 
            ]);
            $booking->unit->update([
                'status' => 'unavailable',
            ]);
            broadcast(new BookingStatusUpdate($booking))->toOthers();   
            $this->telegram->sendToUser($booking->user_id, "Your booking {$booking->booking_ref} has been approved!");
            return response()->json([
                'message' => 'Booking has been approved successfully!', 
            ], 200);
        } else{
            return response()->json([
                'message' => 'only owner can approve booking!',
            ], 403);
        }
    }

    public function reject(Booking $booking){
        $user = Auth::user();
        if ($user->role === 'owner' && $booking->unit->user_id === $user->id){
            if ($booking->status !== 'pending'){
                return response()->json([
                    'message' => 'Only pending bookings can be rejected.'
                ], 422);
            }
            $booking->update(['status' => 'rejected']);
            broadcast(new BookingStatusUpdate($booking))->toOthers();
            $this->telegram->sendToUser($booking->user_id, "Your booking {$booking->booking_ref} has been rejected!");
            return response()->json([
                'message' => 'Booking rejected',
                'booking' => $booking->fresh(),
            ]);   
        } else {
            return response()->json([
                'message' => 'Only owner can reject booking!',
            ], 403);
        }
    }

    public function cancelled(Booking $booking){
        $user = Auth::user();
        if ($user->role === 'user' && $booking->user_id === $user->id){
            if ($booking->status === 'pending' || $booking->status === 'approved'){
                $booking->unit->update(['status' => 'available']);
                $booking->update(['status' => 'cancelled']);
                broadcast(new BookingStatusUpdate($booking))->toOthers();
                return response()->json([
                    'message' => 'Booking has been cancelled!',
                    'booking' => $booking->fresh(),
                ], 200);
            } else{
                return response()->json([
                    'message' => 'Booking cannot be cancelled at this stage.'
                ], 422);
            }
        }else{
            return response()->json([
                'message' => 'Only tenant can cancel booking!'
            ], 403);
        }
    }
}
