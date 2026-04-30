<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use App\Models\RoomPayment;
use Illuminate\Http\Request;
use Carbon\Carbon;

class BookingController extends Controller
{
    /**
     * 'Tenant' submits a booking request after payment.
     * POST /api/bookings
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_id'      => 'required|exists:rooms,id',
            'tenant_name'  => 'required|string',
            'tenant_email' => 'required|email',
            // 'start_date'   => 'required|date',
            // 'end_date'     => 'required|date|after:start_date',
            // 'total_amount' => 'required|numeric|min:0',
        ]);

        $room = Room::findOrFail($validated['room_id']);

        // Block booking if room is already occupied
        if ($room->occupancy_status === 'occupied') {
            return response()->json([
                'message' => 'This room is already occupied and not available for booking.',
            ], 422);
        }

        // Block if room already has an active approved booking
        $alreadyApproved = Booking::where('room_id', $room->id)
            ->where('status', 'approved')
            ->exists();

        if ($alreadyApproved) {
            return response()->json([
                'message' => 'This room already has an approved tenant.',
            ], 422);
        }

        // Block if there's already a pending booking from the same email for this room
        $duplicatePending = Booking::where('room_id', $room->id)
            ->where('tenant_email', $validated['tenant_email'])
            ->where('status', 'pending')
            ->exists();

        if ($duplicatePending) {
            return response()->json([
                'message' => 'You already have a pending booking request for this room.',
            ], 422);
        }

        //tenant only submit booking request, owner will decide the dates and total amount
        $booking = Booking::create([
            'room_id'      => $room->id,
            'owner_id'     => $room->owner_id,
            'tenant_name'  => $validated['tenant_name'],
            'tenant_email' => $validated['tenant_email'],
            // 'start_date'   => $validated['start_date'],
            // 'end_date'     => $validated['end_date'],
            // 'total_amount' => $validated['total_amount'],
            'status'       => 'pending',
        ]);

        return response()->json([
            'message' => 'Booking request submitted successfully.',
            'booking' => $booking,
        ], 201);
    }

    /**
     * Owner views all booking requests for their rooms.
     * GET /api/owner/bookings?owner_id=1&status=pending
     */
    public function index(Request $request)
    {
        //get data from URL, (/owner_id=5, $ownerId=5)
        $ownerId = $request->query('owner_id');
        $status  = $request->query('status'); // pending | approved | rejected

        $query = Booking::with('room')
            ->where('owner_id', $ownerId)
            ->orderByRaw("FIELD(status, 'pending', 'approved', 'rejected')")
            ->orderBy('created_at', 'desc');

        if ($status && in_array($status, ['pending', 'approved', 'rejected', 'completed'])) {
            $query->where('status', $status);
        }

        // for frontend to display
        $bookings = $query->get()->map(function ($booking) {
            return [
                'id'           => $booking->id,
                'tenant_name'  => $booking->tenant_name,
                'tenant_email' => $booking->tenant_email,
                'room_id'      => $booking->room_id,
                'room_name'    => $booking->room->name ?? 'Unknown Room',
                'room_number'  => $booking->room->room_number ?? null,
                // internal server problem because of null value, so need to add ? before format to handle null safely
                // ended up causing dashboard to crash
                'start_date' => $booking->start_date?->format('Y-m-d'),
                'end_date'   => $booking->end_date?->format('Y-m-d'),
                'total_amount' => $booking->total_amount,
                'status'       => $booking->status,
                'created_at'   => $booking->created_at->format('Y-m-d H:i'),
            ];
        });

        $pendingCount   = Booking::where('owner_id', $ownerId)->where('status', 'pending')->count();
        $approvedCount  = Booking::where('owner_id', $ownerId)->where('status', 'approved')->count();
        $rejectedCount  = Booking::where('owner_id', $ownerId)->where('status', 'rejected')->count();
        $completedCount = Booking::where('owner_id', $ownerId)->where('status', 'completed')->count();

        return response()->json([
            'bookings' => $bookings,
            'counts'   => [
                'all'       => $bookings->count(),
                'pending'   => $pendingCount,
                'approved'  => $approvedCount,
                'rejected'  => $rejectedCount,
                'completed' => $completedCount,
            ],
        ]);
    }

    /**
     * Owner approves a booking request.
     * PATCH /api/owner/bookings/{booking}/approve
     */
    public function approve(Request $request, Booking $booking)
    {
        // check data after owner approve the booking
        // important because need for total amount calculation
        $validatedBooking = $request->validate([
            'start_date'   => 'required|date',
            'end_date'     => 'required|date|after:start_date',
        ]);
        // totalAmount is calculate here instead of at the frontend like before

        //how to get data from another table and put in variable
        $monthly_rent = $booking->room->monthly_rent ?? 0; // Fallback to 0 if monthly_rent is null
        //amt entered by owner * numbers of months
        // carbon convert string to date and calculate the difference in months
        // find the month amount with diffInMonths, if less than 1 month, charge for 1 month
        $totalAmount = $booking->total_amount = $monthly_rent * Carbon::parse($validatedBooking['start_date'])->diffInMonths(Carbon::parse($validatedBooking['end_date']));

        if ($booking->status !== 'pending') {
            return response()->json(['message' => 'Only pending bookings can be approved.'], 422);
        } 

        // Approve this booking then update
        $booking->update([
            'status' => 'approved',
            'total_amount' => $totalAmount,
            'start_date'   => $validatedBooking['start_date'],
            'end_date'     => $validatedBooking['end_date'],
        ]);

        // Update room: mark as occupied and paid
        $booking->room->update([
            'occupancy_status' => 'occupied',
            'payment_status'   => 'paid',
        ]);

        // Record the payment
        RoomPayment::create([
            'room_id'  => $booking->room_id,
            'owner_id' => $booking->owner_id,
            'amount'   => $totalAmount,
            'paid_at'  => Carbon::now()->toDateString(),
        ]);

        // Auto-reject all other pending bookings for the same room
        Booking::where('room_id', $booking->room_id)
            ->where('id', '!=', $booking->id)
            ->where('status', 'pending')
            ->update(['status' => 'rejected']);

        return response()->json([
            'message' => 'Booking approved successfully.',
            'booking' => $booking->fresh(),
        ]);
    }

    /**
     * Owner rejects a booking request.
     * PATCH /api/owner/bookings/{booking}/reject
     */
    public function reject(Booking $booking)
    {
        if ($booking->status !== 'pending') {
            return response()->json(['message' => 'Only pending bookings can be rejected.'], 422);
        }

        $booking->update(['status' => 'rejected']);

        return response()->json([
            'message' => 'Booking rejected.',
            'booking' => $booking->fresh(),
        ]);
    }

    /**
     * Get pending bookings count for notification badge.
     * GET /api/owner/bookings/pending-count?owner_id=1
     */
    public function pendingCount(Request $request)
    {
        $ownerId = $request->query('owner_id');

        $count = Booking::where('owner_id', $ownerId)
            ->where('status', 'pending')
            ->count();

        return response()->json(['pending_count' => $count]);
    }
}
