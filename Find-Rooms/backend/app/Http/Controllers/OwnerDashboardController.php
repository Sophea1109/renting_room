<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\RoomPayment;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OwnerDashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $ownerId = $request->query('owner_id');

        $roomsQuery = Room::query();
        $paymentsQuery = RoomPayment::query();

        if ($ownerId) {
            $roomsQuery->where('owner_id', $ownerId);
            $paymentsQuery->where('owner_id', $ownerId);
        }

        $rooms = $roomsQuery->orderBy('id')->get();
        $payments = $paymentsQuery->get();

        $totalRooms = $rooms->count();
        $occupiedRooms = $rooms->where('occupancy_status', 'occupied')->count();
        $availableRooms = $rooms->where('occupancy_status', 'available')->count();
        $totalRevenue = (float) $payments->sum('amount');
        $occupancyRate = $totalRooms > 0 ? round(($occupiedRooms / $totalRooms) * 100, 1) : 0;

        $monthlyRevenue = $this->buildMonthlyRevenue($payments);
        $averageMonthlyGrowth = $this->averageMonthlyGrowth($monthlyRevenue);

        return response()->json([
            'cards' => [
                'totalRevenue' => $totalRevenue,
                'totalRooms' => $totalRooms,
                'occupiedRooms' => $occupiedRooms,
                'availableRooms' => $availableRooms,
            ],
            'performanceSummary' => [
                'averageMonthlyGrowth' => $averageMonthlyGrowth,
                'occupancyRate' => $occupancyRate,
            ],
            'charts' => [
                'monthlyRevenue' => $monthlyRevenue,
            ],
            'rooms' => $rooms->map(fn (Room $room) => $this->formatRoom($room))->values(),
        ]);
    }

    public function createRoom(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'monthly_rent' => 'required|numeric|min:0',
            'owner_id' => 'nullable|integer|exists:users,id',
            'occupancy_status' => 'nullable|in:available,occupied',
            'payment_status' => 'nullable|in:paid,unpaid',
        ]);

        $room = Room::create([
            'owner_id' => $validated['owner_id'] ?? null,
            'name' => $validated['name'],
            'monthly_rent' => $validated['monthly_rent'],
            'occupancy_status' => $validated['occupancy_status'] ?? 'available',
            'payment_status' => $validated['payment_status'] ?? 'unpaid',
        ]);

        if ($room->payment_status === 'paid') {
            RoomPayment::create([
                'room_id' => $room->id,
                'owner_id' => $room->owner_id,
                'amount' => $room->monthly_rent,
                'paid_at' => Carbon::today()->toDateString(),
            ]);
        }

        return response()->json([
            'message' => 'Room created successfully',
            'room' => $this->formatRoom($room),
        ], 201);
    }

    public function updateRoomStatus(Request $request, Room $room): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'monthly_rent' => 'sometimes|numeric|min:0',
            'occupancy_status' => 'sometimes|in:available,occupied',
            'payment_status' => 'sometimes|in:paid,unpaid',
            'paid_at' => 'nullable|date',
        ]);

        $previousPaymentStatus = $room->payment_status;

        if (array_key_exists('name', $validated)) {
            $room->name = $validated['name'];
        }

        if (array_key_exists('monthly_rent', $validated)) {
            $room->monthly_rent = $validated['monthly_rent'];
        }

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
            RoomPayment::create([
                'room_id' => $room->id,
                'owner_id' => $room->owner_id,
                'amount' => $room->monthly_rent,
                'paid_at' => $validated['paid_at'] ?? Carbon::today()->toDateString(),
            ]);
        }

        return response()->json([
            'message' => 'Room status updated successfully',
            'room' => $this->formatRoom($room),
        ]);
    }

    private function formatRoom(Room $room): array
    {
        return [
            'id' => $room->id,
            'name' => $room->name,
            'monthlyRent' => (float) $room->monthly_rent,
            'occupancyStatus' => $room->occupancy_status,
            'paymentStatus' => $room->payment_status,
        ];
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
                'month' => $monthStart->format('M'),
                'revenue' => $monthTotal,
            ];
        })->values()->all();
    }

    private function averageMonthlyGrowth(array $monthlyRevenue): float
    {
        $growths = [];

        for ($i = 1; $i < count($monthlyRevenue); $i++) {
            $previous = $monthlyRevenue[$i - 1]['revenue'];
            $current = $monthlyRevenue[$i]['revenue'];

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