<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BookingController extends Controller
{

    public function index(Request $request)
{
    $user = $request->user();
    
    // Start the query with the necessary relations
    $query = Booking::with(['unit.property', 'user']);

    // Admin sees all; Owner sees only their own bookings
    if ($user && $user->role !== 'admin') {
        // Assuming bookings are linked to a user_id
        $query->where('user_id', $user->id);
    }
    
    return response()->json([
        'data' => $query->latest()->get()
    ]);
}
    public function store(Request $request)
{
    $request->validate([
        'unit_id' => 'required|exists:units,id',
        'check_in' => 'required|date',
        'check_out' => 'required|date|after:check_in',
        'payment_method' => 'required|string',
        'transaction_ref' => 'nullable|string|max:255',
    ]);

    return DB::transaction(function () use ($request) {

        $unit = Unit::where('id', $request->unit_id)
            ->lockForUpdate()
            ->firstOrFail();

        // 🔥 1. CHECK OVERLAP (REAL RULE)
        $isBooked = Booking::where('unit_id', $unit->id)
            ->whereIn('status', ['confirmed', 'checked_in'])
            ->where('check_in', '<', $request->check_out)
            ->where('check_out', '>', $request->check_in)
            ->exists();

        if ($isBooked) {
            return response()->json([
                'success' => false,
                'message' => 'This unit is already booked for selected dates.'
            ], 409);
        }

        // 🔥 2. CALCULATE PRICE
        $totalAmount = $this->calculateTotalLogic(
            $unit,
            $request->check_in,
            $request->check_out
        );

        $methodInput = strtolower($request->payment_method);

        $mappedMethod = ($methodInput === 'visa')
            ? 'bank_transfer'
            : 'cash_on_arrival';

        $bookingStatus = ($methodInput === 'visa')
            ? 'confirmed'
            : 'pending';

        $paymentStatus = ($methodInput === 'visa')
            ? 'completed'
            : 'pending';

        // 🔥 3. CREATE BOOKING
        $booking = Booking::create([
            'user_id' => auth()->id() ?? 4,
            'unit_id' => $unit->id,
            'property_id' => $unit->property_id,
            'check_in' => $request->check_in,
            'check_out' => $request->check_out,
            'total' => $totalAmount,
            'status' => $bookingStatus,
        ]);

        // 🔥 4. PAYMENT
        Payment::create([
            'b_id' => $booking->id,
            'payment_method' => $mappedMethod,
            'payment_status' => $paymentStatus,
            'transaction_ref' => $request->transaction_ref
                ?? (($methodInput === 'visa')
                    ? 'VISA-' . strtoupper(uniqid())
                    : null),
        ]);

        // 🔥 5. AUTO STATUS UPDATE (REAL LOGIC)
        $activeBooking = Booking::where('unit_id', $unit->id)
            ->whereIn('status', ['confirmed', 'checked_in'])
            ->exists();

        $unit->update([
            'status' => $activeBooking ? 'unavailable' : 'available'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Booking created successfully',
            'data' => $booking->load('unit')
        ], 201);
    });
}
public function availability($id)
{
    $unit = Unit::findOrFail($id);

    $isBooked = Booking::where('unit_id', $id)
        ->whereIn('status', ['confirmed', 'checked_in'])
        ->where('check_out', '>', now())
        ->exists();

    return response()->json([
        'unit_id' => $id,
        'available' => !$isBooked
    ]);
}
    /*
    |---------------------------------------------
    | PRICE ENGINE
    |---------------------------------------------
    */
    private function calculateTotalLogic($unit, $checkIn, $checkOut)
    {
        $start = Carbon::parse($checkIn);
        $end   = Carbon::parse($checkOut);

        $days = max(1, $start->diffInDays($end));
        $price = (float) $unit->price;

        return match ($unit->price_type) {
            'month' => ($days >= 30)
                ? ($start->diffInMonths($end) * $price)
                : (($price / 30) * $days),

            'year' => ($days >= 365)
                ? ($start->diffInYears($end) * $price)
                : (($price / 12) * max(1, $start->diffInMonths($end))),

            default => $days * $price,
        };
    }
    public function myBookings(Request $request) 
{
    // Make sure you are using auth()->id() or $request->user()->id
    $bookings = Booking::with('unit')
        ->where('user_id', auth()->id()) 
        ->get();

    return response()->json(['data' => $bookings]);
}
}