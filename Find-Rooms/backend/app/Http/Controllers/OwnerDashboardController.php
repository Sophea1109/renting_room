<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\RoomPayment;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class OwnerDashboardController extends Controller
{ //image
    public function index(Request $request): JsonResponse
    {
        $ownerId = $request->query('owner_id');

        $rooms = collect();
        $payments = collect();

        if (Schema::hasTable('rooms')) {
            $roomsQuery = Room::query();
            if ($ownerId) {
                $roomsQuery->where('owner_id', $ownerId);
            }
            $rooms = $roomsQuery->orderBy('id')->get();
        }

        if (Schema::hasTable('room_payments')) {
            $paymentsHasOwnerId = Schema::hasColumn('room_payments', 'owner_id');
            $paymentsQuery = RoomPayment::query();
            if ($ownerId && $paymentsHasOwnerId) {
                $paymentsQuery->where('owner_id', $ownerId);
            }
            $payments = $paymentsQuery->get();
        }

        $totalRooms = $rooms->count();
        $occupiedRooms = $rooms->where('occupancy_status', 'occupied')->count();
        $availableRooms = $rooms->where('occupancy_status', 'available')->count();
        $totalRevenue = (float) $payments->sum('amount');
        $occupancyRate = $totalRooms > 0 ? round(($occupiedRooms / $totalRooms) * 100, 1) : 0;

        $monthlyRevenue = $this->buildMonthlyRevenue($payments);
        $averageMonthlyGrowth = $this->averageMonthlyGrowth($monthlyRevenue);

        return response()->json([
            'cards' => [
                'totalRevenue'   => $totalRevenue,
                'totalRooms'     => $totalRooms,
                'occupiedRooms'  => $occupiedRooms,
                'availableRooms' => $availableRooms,
            ],
            'performanceSummary' => [
                'averageMonthlyGrowth' => $averageMonthlyGrowth,
                'occupancyRate'        => $occupancyRate,
            ],
            'charts' => [
                'monthlyRevenue' => $monthlyRevenue,
            ],
            'rooms' => $rooms->map(function (Room $room) {
                return [
                    'id'              => $room->id,
                    'roomNumber'      => $room->room_number,
                    'name'            => $room->name,
                    'type'            => $room->type,
                    'monthlyRent'     => (float) $room->monthly_rent,
                    'beds'            => $room->beds,
                    'baths'           => $room->baths,
                    'size'            => $room->size,
                    'description'     => $room->description,
                    'location'        => $room->location,
                    'contactEmail'    => $room->contact_email,
                    'amenities'       => $room->amenities ?? [],
                    'images'          => $room->images ?? [],
                    'occupancyStatus' => $room->occupancy_status,
                    'paymentStatus'   => $room->payment_status,
                ];
            })->values(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'owner_id'         => 'required|exists:users,id',
            'room_number'      => 'nullable|string',
            'name'             => 'required|string',
            'type'             => 'nullable|string',
            'monthly_rent'     => 'required|numeric|min:0',
            'beds'             => 'nullable|integer|min:1',
            'baths'            => 'nullable|integer|min:1',
            'size'             => 'nullable|string',
            'description'      => 'nullable|string',
            'location'         => 'nullable|string',
            'contact_email'    => 'nullable|email',
            'amenities'        => 'nullable|array',
            'amenities.*'      => 'string',
            'images'           => 'nullable|array',
            'images.*'         => 'string',
            'occupancy_status' => 'nullable|in:available,occupied,maintenance,reserved,cleaning',
            'payment_status'   => 'nullable|in:paid,unpaid',
        ]);

        $room = Room::create($validated);

        return response()->json([
            'message' => 'Room created successfully',
            'room'    => [
                'id'              => $room->id,
                'roomNumber'      => $room->room_number,
                'name'            => $room->name,
                'type'            => $room->type,
                'monthlyRent'     => (float) $room->monthly_rent,
                'beds'            => $room->beds,
                'baths'           => $room->baths,
                'size'            => $room->size,
                'description'     => $room->description,
                'location'        => $room->location,
                'contactEmail'    => $room->contact_email,
                'amenities'       => $room->amenities ?? [],
                'images'          => $room->images ?? [],
                'occupancyStatus' => $room->occupancy_status,
                'paymentStatus'   => $room->payment_status,
            ],
        ], 201);
    }

    public function update(Request $request, Room $room): JsonResponse
    {
        $validated = $request->validate([
            'room_number'   => 'nullable|string',
            'name'          => 'sometimes|required|string',
            'type'          => 'nullable|string',
            'monthly_rent'  => 'sometimes|required|numeric|min:0',
            'beds'          => 'nullable|integer|min:1',
            'baths'         => 'nullable|integer|min:1',
            'size'          => 'nullable|string',
            'description'   => 'nullable|string',
            'location'      => 'nullable|string',
            'contact_email' => 'nullable|email',
            'amenities'     => 'nullable|array',
            'amenities.*'   => 'string',
            'images'        => 'nullable|array',
            'images.*'      => 'string',
        ]);

        $room->update($validated);

        return response()->json([
            'message' => 'Room updated successfully',
            'room'    => [
                'id'              => $room->id,
                'roomNumber'      => $room->room_number,
                'name'            => $room->name,
                'type'            => $room->type,
                'monthlyRent'     => (float) $room->monthly_rent,
                'beds'            => $room->beds,
                'baths'           => $room->baths,
                'size'            => $room->size,
                'description'     => $room->description,
                'location'        => $room->location,
                'contactEmail'    => $room->contact_email,
                'amenities'       => $room->amenities ?? [],
                'images'          => $room->images ?? [],
                'occupancyStatus' => $room->occupancy_status,
                'paymentStatus'   => $room->payment_status,
            ],
        ]);
    }

    public function destroy(Room $room): JsonResponse
    {
        $room->delete();

        return response()->json([
            'message' => 'Room deleted successfully',
        ]);
    }

    public function updateRoomStatus(Request $request, Room $room): JsonResponse
    {
        $validated = $request->validate([
            'occupancy_status' => 'sometimes|in:available,occupied',
            'payment_status'   => 'sometimes|in:paid,unpaid',
            'paid_at'          => 'nullable|date',
        ]);

        $previousPaymentStatus = $room->payment_status;

        if (array_key_exists('occupancy_status', $validated)) {
            $room->occupancy_status = $validated['occupancy_status'];
        }

        if (array_key_exists('payment_status', $validated)) {
            $room->payment_status = $validated['payment_status'];
        }

        $room->save();

        if (
            array_key_exists('payment_status', $validated)
            && $previousPaymentStatus !== 'paid'
            && $validated['payment_status'] === 'paid'
        ) {
             $paymentPayload = [
                'amount'   => $room->monthly_rent,
                'paid_at'  => $validated['paid_at'] ?? Carbon::today()->toDateString(),
            ];
             if (Schema::hasTable('room_payments') && Schema::hasColumn('room_payments', 'room_id')) {
                $paymentPayload['room_id'] = $room->id;
            }

            if (Schema::hasTable('room_payments') && Schema::hasColumn('room_payments', 'owner_id')) {
                $paymentPayload['owner_id'] = $room->owner_id;
            }

            RoomPayment::create($paymentPayload);
        }

        return response()->json([
            'message' => 'Room status updated successfully',
            'room'    => [
                'id'              => $room->id,
                'name'            => $room->name,
                'occupancyStatus' => $room->occupancy_status,
                'paymentStatus'   => $room->payment_status,
            ],
        ]);
    }

    private function buildMonthlyRevenue($payments): array
    {
        $months = collect(range(5, 0))->map(function ($offset) {
            return Carbon::now()->subMonths($offset)->startOfMonth();
        })->push(Carbon::now()->startOfMonth());

        return $months->map(function (Carbon $monthStart) use ($payments) {
            $monthEnd = $monthStart->copy()->endOfMonth();
            $monthTotal = (float) $payments
                ->whereBetween('paid_at', [$monthStart->toDateString(), $monthEnd->toDateString()])
                ->sum('amount');

            return [
                'month'   => $monthStart->format('M'),
                'revenue' => $monthTotal,
            ];
        })->values()->all();
    }

    private function averageMonthlyGrowth(array $monthlyRevenue): float
    {
        $growths = [];

        for ($i = 1; $i < count($monthlyRevenue); $i++) {
            $previous = $monthlyRevenue[$i - 1]['revenue'];
            $current  = $monthlyRevenue[$i]['revenue'];

            if ($previous > 0) {
                $growths[] = (($current - $previous) / $previous) * 100;
            }
        }

        if (empty($growths)) {
            return 0;
        }

        return round(array_sum($growths) / count($growths), 1);
    }
}
