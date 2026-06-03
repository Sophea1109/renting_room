<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    /**
     * Display checkout bill details before a user triggers card payment authentication.
     */
    public function showGateway($bookingId)
    {
        // Load booking with relational chains
        $booking = Booking::with(['payment', 'unit'])->findOrFail($bookingId);

        // Security Validation: Ensure the target booking hasn't been finalized yet
        if ($booking->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'This booking sequence is no longer eligible for active authorization.'
            ], 400);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'booking_id'     => $booking->id,
                'room_title'     => $booking->unit->title, 
                'amount_due'     => (float) $booking->total,
                'payment_status' => $booking->payment->payment_status ?? 'pending'
            ]
        ], 200);
    }

    /**
     * Client Direct Capture Endpoint: Processes incoming requests from Next.js checkout form.
     */
    /**
     * Client Direct Capture Endpoint: Processes incoming requests from Next.js checkout form.
     */
    public function processVisaCheckout(Request $request)
{
    $request->validate([
        'booking_id' => 'required|exists:bookings,id',
        'card_name'  => 'required|string|max:255',
    ]);

    $booking = Booking::findOrFail($request->booking_id);

    $booking = Booking::findOrFail($request->booking_id);

    // 💡 FIX: Allow the request to proceed if it's already 'confirmed' (Idempotency)
    if ($booking->status === 'confirmed') {
        return response()->json([
            'success' => true, 
            'message' => 'Booking already processed.'
        ], 200);
    }

    // Only reject if it's actually in a failed or invalid state
    if ($booking->status !== 'pending') {
        return response()->json(['success' => false, 'message' => 'Booking state mismatch.'], 422);
    }
    // Capture the ID as a standalone variable before entering the database transaction closure
    $targetBookingId = (int) $request->booking_id;

    return DB::transaction(function () use ($booking, $targetBookingId) {
        $unit = $booking->unit;
        $mockRef = 'VISA-' . strtoupper(uniqid());

        // 🛡️ Bypassing all Eloquent relation magic entirely to force a clean SQL insert
        DB::table('payments')->updateOrInsert(
            ['booking_id' => $targetBookingId], // Lookup criteria
            [
                'payment_method'  => 'bank_transfer',
                'payment_status'  => 'completed',
                'transaction_ref' => $mockRef,
                'created_at'      => now(),
                'updated_at'      => now(),
            ]
        );

        // 2. Advance structural status rules
        $booking->update(['status' => 'confirmed']);
        
        // 3. Prevent duplicate overlaps
        if ($unit) {
            $unit->update(['status' => 'unavailable']);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'booking_id'     => $booking->id,
                'room_title'     => $booking->unit->title ?? $booking->unit->tittle,
                'amount_due'     => (float) ($booking->total ?? 0),
                'payment_status' => $booking->payment->payment_status ?? 'pending'
            ]
        ], 200);
    });
}
    /**
     * Webhook Callback: Processes the bank's async server-to-server transaction signal.
     */
    public function processCallback(Request $request)
    {
        $request->validate([
            'booking_id'            => 'required|exists:bookings,id',
            'transaction_status'    => 'required|in:SUCCESS,FAILED',
            'transaction_reference' => 'required|string',
        ]);

        $booking = Booking::with(['payment', 'unit'])->findOrFail($request->booking_id);

        return DB::transaction(function () use ($booking, $request) {
            $unit = $booking->unit;

            if ($request->transaction_status === 'SUCCESS') {
                // FIX: Fallback safely using updateOrCreate
                $booking->payment()->updateOrCreate(
                    ['booking_id' => $booking->id],
                    [
                        'payment_method'  => 'bank_transfer',
                        'payment_status'  => 'completed',
                        'transaction_ref' => $request->transaction_reference,
                    ]
                );

                $booking->update(['status' => 'confirmed']);
                $unit->update(['status' => 'unavailable']);

                return response()->json(['success' => true, 'message' => 'Payment webhook processed successfully!'], 200);
            } else {
                // Failure path: Cancel booking and release unit back to market inventory
                $booking->payment()->updateOrCreate(
                    ['booking_id' => $booking->id],
                    [
                        'payment_status' => 'failed'
                    ]
                );
                
                $booking->update(['status' => 'cancelled']);
                $unit->update(['status' => 'available']);

                return response()->json(['success' => false, 'message' => 'Transaction failure updated.'], 422);
            }
        });
    }
}