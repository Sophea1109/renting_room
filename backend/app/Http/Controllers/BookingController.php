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
     * Tenant submits a booking request after payment.
     * POST /api/bookings
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_id'      => 'required|exists:rooms,id',
            'tenant_name'  => 'required|string',
            'tenant_email' => 'required|email',
            'start_date'   => 'required|date',
            'end_date'     => 'required|date|after:start_date',
            'total_amount' => 'required|numeric|min:0',
        ]);

        $room = Room::findOrFail($validated['room_id']);

        $booking = Booking::create([
            'room_id'      => $room->id,
            'owner_id'     => $room->owner_id,
            'tenant_name'  => $validated['tenant_name'],
            'tenant_email' => $validated['tenant_email'],
            'start_date'   => $validated['start_date'],
            'end_date'     => $validated['end_date'],
            'total_amount' => $validated['total_amount'],
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
        $ownerId = $request->query('owner_id');
        $status  = $request->query('status'); // pending | approved | rejected

        $query = Booking::with('room')
            ->where('owner_id', $ownerId)
            ->orderByRaw("FIELD(status, 'pending', 'approved', 'rejected')")
            ->orderBy('created_at', 'desc');

        if ($status && in_array($status, ['pending', 'approved', 'rejected'])) {
            $query->where('status', $status);
        }

        $bookings = $query->get()->map(function ($booking) {
            return [
                'id'           => $booking->id,
                'tenant_name'  => $booking->tenant_name,
                'tenant_email' => $booking->tenant_email,
                'room_id'      => $booking->room_id,
                'room_name'    => $booking->room->name ?? 'Unknown Room',
                'room_number'  => $booking->room->room_number ?? null,
                'start_date'   => $booking->start_date->format('Y-m-d'),
                'end_date'     => $booking->end_date->format('Y-m-d'),
                'total_amount' => $booking->total_amount,
                'status'       => $booking->status,
                'created_at'   => $booking->created_at->format('Y-m-d H:i'),
            ];
        });

        $pendingCount  = Booking::where('owner_id', $ownerId)->where('status', 'pending')->count();
        $approvedCount = Booking::where('owner_id', $ownerId)->where('status', 'approved')->count();
        $rejectedCount = Booking::where('owner_id', $ownerId)->where('status', 'rejected')->count();

        return response()->json([
            'bookings' => $bookings,
            'counts'   => [
                'all'      => $bookings->count(),
                'pending'  => $pendingCount,
                'approved' => $approvedCount,
                'rejected' => $rejectedCount,
            ],
        ]);
    }

    /**
     * Owner approves a booking request.
     * PATCH /api/owner/bookings/{booking}/approve
     */
    public function approve(Booking $booking)
    {
        if ($booking->status !== 'pending') {
            return response()->json(['message' => 'Only pending bookings can be approved.'], 422);
        }

        // Approve this booking
        $booking->update(['status' => 'approved']);

        // Update room: mark as occupied and paid
        $booking->room->update([
            'occupancy_status' => 'occupied',
            'payment_status'   => 'paid',
        ]);

        // Record the payment
        RoomPayment::create([
            'room_id'  => $booking->room_id,
            'owner_id' => $booking->owner_id,
            'amount'   => $booking->total_amount,
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
