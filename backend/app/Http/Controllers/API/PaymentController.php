<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Unit;
use Illuminate\Support\Facades\Auth;
use App\Models\Booking;
use App\Models\Payment;
use App\Services\TelegramService;

class PaymentController extends Controller
{
    public function __construct(private TelegramService $telegram){
        
    }
    // mark booking as paid, create payment record, trigger receipt
    public function payNow(Request $request, Booking $booking){
        $validated = $request->validate([
            'slip_image' => 'required|image|mimes:jpg,jpeg,png|max:2048'
        ]);
        $validated['user_id'] = Auth::id();

        $user = Auth::user();
        if ($user->role === 'user' && $booking->user_id === $user->id){
            //prevent duplication
            $paidAlready = Payment::where('booking_id', $booking->id)->whereIn('payment_status', ['pending_verification' ,'paid'])->exists();
            if($paidAlready){
                return response()->json([
                    'message' => 'This booking has already been paid',
                ], 422);
            }

            $slipPath = $request->file('slip_image')->store('slips', 'public');
            $payment = Payment::create([
                'booking_id' => $booking->id,
                'user_id' => $validated['user_id'],
                'amount' => $booking->total_price,
                'payment_status' => 'pending_verification',
                'slip_image' => $slipPath
            ]);
            $this->telegram->sendToUser($booking->unit->user_id, "New payment {$booking->booking_ref}.");

            return response()->json([
                'message' => 'Payment has been created successfully',
                'payment' => $payment,
            ], 201);
        } else {
            return response()->json([
                'message' => 'payment cannot be made'
            ], 403);
        }
    }

    public function verify(Booking $booking, Payment $payment){
        $user = Auth::user();
        $booking = $payment->booking;
        if ($user->role === 'owner' && $booking->unit->user_id === $user->id){
            if ($payment->payment_status === 'pending_verification'){
                $payment->update([
                    'payment_status' => 'paid',
                    'paid_at' => now(),
                ]);
                $this->telegram->sendToUser($booking->unit->user_id, "New payment slip uploaded for booking {$booking->booking_ref}.");
                return response()->json([
                    'message' => 'Payment verified successfully!!',
                    'payment' => $payment->fresh(),
                ], 200);
            } else {
                return response()->json([
                    'message' => 'Payment is not pending',
                ], 422);
            }
        } else{
            return response()->json([
                'message' => 'Only owner can own units.' 
            ], 403);
        }
    }

    // list all payment for current user
    public function history(Request $request){
        $userId = Auth::id();
        $query = Payment::with('booking')
            ->where('user_id', $userId)
            ->orderByRaw("FIELD(payment_status, 'unpaid', 'pending_verification', 'paid', 'refunded')")
            ->orderBy('created_at', 'desc');

        $payments = $query->get()->map(function ($payment){
            return [
                'booking_ref' => $payment->booking->booking_ref,
                'amount' => $payment->amount,
                'payment_status' => $payment->payment_status,
                'paid_at' => $payment->paid_at,
                'payment_method' => $payment->payment_method,
                'slip_image' => $payment->slip_image,
            ];
        });

        $paidCounting = Payment::where('user_id', $userId)->where('payment_status', 'paid')->count();
        $unpaidCounting = Payment::where('user_id', $userId)->where('payment_status', 'unpaid')->count();
        $pendingVerificationCounting = Payment::where('user_id', $userId)->where('payment_status', 'pending_verification')->count();
        $refundedCounting = Payment::where('user_id', $userId)->where('payment_status', 'refunded')->count();

        return response()->json([
            'payments' => $payments,
            'count' => [
                'all' => $payments->count(),
                'paid' => $paidCounting,
                'unpaid' => $unpaidCounting,
                'pending_verification' => $pendingVerificationCounting,
                'refunded' => $refundedCounting,
            ],
        ]);
    }

    //all payment for an owner's unit
    public function ownerPayment(){
        $userId = Auth::id();
        $query = Payment::with('booking')
            ->whereHas('booking.unit', function($q) use ($userId) {
                $q->where('user_id', $userId);
            })
            ->orderByRaw("FIELD(payment_status, 'unpaid', 'pending_verification', 'paid', 'refunded')")
            ->orderBy('created_at', 'desc');

        $payments = $query->get()->map(function ($payment){
            return [
                'booking_ref' => $payment->booking->booking_ref,
                'amount' => $payment->amount,
                'payment_status' => $payment->payment_status,
                'paid_at' => $payment->paid_at,
                'payment_method' => $payment->payment_method,
                'slip_image' => $payment->slip_image,
            ];
        });

        $paidCounting = Payment::whereHas('booking.unit', function($q) use ($userId) {
            $q->where('user_id', $userId);
        })->where('payment_status', 'paid')->count();
        $unpaidCounting = Payment::whereHas('booking.unit', function($q) use ($userId) {
            $q->where('user_id', $userId);
        })->where('payment_status', 'unpaid')->count();
        $pendingVerificationCounting = Payment::whereHas('booking.unit', function($q) use ($userId) {
            $q->where('user_id', $userId);
        })->where('payment_status', 'pending_verification')->count();
        $refundedCounting = Payment::whereHas('booking.unit', function($q) use ($userId) {
            $q->where('user_id', $userId);
        })->where('payment_status', 'refunded')->count();

        return response()->json([
            'payments' => $payments,
            'count' => [
                'all' => $payments->count(),
                'paid' => $paidCounting,
                'unpaid' => $unpaidCounting,
                'pending_verification' => $pendingVerificationCounting,
                'refunded' => $refundedCounting,
            ],
        ]);
    }
}
