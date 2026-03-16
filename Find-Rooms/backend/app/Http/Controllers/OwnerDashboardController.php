<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\RoomPayment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class OwnerDashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $ownerId = $request->query('owner_id');

        $roomsQuery = Room::query();

        if ($ownerId) {
            $roomsQuery->where('owner_id', $ownerId);
        }

        $rooms = $roomsQuery->orderBy('id')->get();

        $totalRooms = $rooms->count();
        $occupiedRooms = $rooms->where('occupancy_status', 'occupied')->count();
        $availableRooms = $rooms->where('occupancy_status', 'available')->count();
        $totalRevenue = (float) $rooms
            ->where('payment_status', 'paid')
            ->sum('monthly_rent');
        $occupancyRate = $totalRooms > 0 ? round(($occupiedRooms / $totalRooms) * 100, 1) : 0;

        $monthlyRevenue = $this->buildMonthlyRevenueFromRooms($rooms);
        $averageMonthlyGrowth = $this->averageMonthlyGrowth($monthlyRevenue);

        return response()->json([
            'cards' => [
                'totalRevenue' => $totalRevenue,
                'totalRooms' => $totalRooms,
                'occupiedRooms' => $occupiedRooms,
                'availableRooms' => $availableRooms,
                'paidRooms' => $rooms->where('payment_status', 'paid')->count(),
                'unpaidRooms' => $rooms->where('payment_status', 'unpaid')->count(),
            ],
            'performanceSummary' => [
                'averageMonthlyGrowth' => $averageMonthlyGrowth,
                'occupancyRate' => $occupancyRate,
            ],
            'charts' => [
                'monthlyRevenue' => $monthlyRevenue,
                'weeklyOccupancy' => $this->buildWeeklyOccupancy($occupiedRooms, $availableRooms),
            ],
            'rooms' => $rooms->map(fn (Room $room) => $this->formatRoom($room))->values(),
        ]);
    }

    public function createRoom(Request $request): JsonResponse
    {
        $this->normalizeEmptyStringsToNull($request, ['owner_name', 'contact_email', 'location', 'description', 'image_url', 'paid_at']);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'monthly_rent' => 'required|numeric|min:0',
            'owner_id' => 'nullable|integer|exists:users,id',
            'owner_name' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string|max:2048',
            'occupancy_status' => 'nullable|in:available,occupied',
            'payment_status' => 'nullable|in:paid,unpaid',
        ]);

        $room = Room::create($this->filterToExistingRoomColumns([
            'owner_id' => $validated['owner_id'] ?? null,
            'owner_name' => $validated['owner_name'] ?? null,
            'contact_email' => $validated['contact_email'] ?? null,
            'name' => $validated['name'],
            'location' => $validated['location'] ?? null,
            'description' => $validated['description'] ?? null,
            'image_url' => $validated['image_url'] ?? null,
            'monthly_rent' => $validated['monthly_rent'],
            'occupancy_status' => $validated['occupancy_status'] ?? 'available',
            'payment_status' => $validated['payment_status'] ?? 'unpaid',
        ]));

        if ($room->payment_status === 'paid') {
            RoomPayment::create([
                'room_id' => $room->id,
                'owner_id' => $this->resolvePaymentOwnerId($room->owner_id),
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
        $this->normalizeEmptyStringsToNull($request, ['owner_name', 'contact_email', 'location', 'description', 'image_url', 'paid_at']);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'monthly_rent' => 'sometimes|numeric|min:0',
            'owner_name' => 'sometimes|nullable|string|max:255',
            'contact_email' => 'sometimes|nullable|email|max:255',
            'location' => 'sometimes|nullable|string|max:255',
            'description' => 'sometimes|nullable|string',
            'image_url' => 'sometimes|nullable|string|max:2048',
            'occupancy_status' => 'sometimes|in:available,occupied',
            'payment_status' => 'sometimes|in:paid,unpaid',
            'paid_at' => 'nullable|date',
        ]);

        $previousPaymentStatus = $room->payment_status;

        $allowedColumns = array_flip($this->getRoomColumns());

        foreach (['name', 'monthly_rent', 'owner_name', 'contact_email', 'location', 'description', 'image_url', 'occupancy_status', 'payment_status'] as $field) {
            if (array_key_exists($field, $validated)) {
                if (!array_key_exists($field, $allowedColumns)) {
                    continue;
                }
                $room->{$field} = $validated[$field];
            }
        }

        $room->save();

        if (
            array_key_exists('payment_status', $validated)
            && $previousPaymentStatus !== 'paid'
            && $validated['payment_status'] === 'paid'
        ) {
            RoomPayment::create([
                'room_id' => $room->id,
                'owner_id' => $this->resolvePaymentOwnerId($room->owner_id),
                'amount' => $room->monthly_rent,
                'paid_at' => $validated['paid_at'] ?? Carbon::today()->toDateString(),
            ]);
        }

        if (
            array_key_exists('payment_status', $validated)
            && $previousPaymentStatus === 'paid'
            && $validated['payment_status'] === 'unpaid'
        ) {
            RoomPayment::create([
                'room_id' => $room->id,
                'owner_id' => $this->resolvePaymentOwnerId($room->owner_id),
                'amount' => -1 * (float) $room->monthly_rent,
                'paid_at' => $validated['paid_at'] ?? Carbon::today()->toDateString(),
            ]);
        }

        return response()->json([
            'message' => 'Room updated successfully',
            'room' => $this->formatRoom($room),
        ]);
    }

    public function deleteRoom(Room $room): JsonResponse
    {
        $room->delete();

        return response()->json([
            'message' => 'Room deleted successfully',
        ]);
    }

    private function formatRoom(Room $room): array
    {
        return [
            'id' => $room->id,
            'name' => $room->name,
            'location' => $room->location,
            'description' => $room->description,
            'imageUrl' => $room->image_url,
            'ownerName' => $room->owner_name,
            'contactEmail' => $room->contact_email,
            'monthlyRent' => (float) $room->monthly_rent,
            'occupancyStatus' => $room->occupancy_status,
            'paymentStatus' => $room->payment_status,
        ];
    }

    private function buildWeeklyOccupancy(int $occupiedRooms, int $availableRooms): array
    {
        $days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        return collect($days)->map(fn ($day) => [
            'day' => $day,
            'occupied' => $occupiedRooms,
            'available' => $availableRooms,
        ])->values()->all();
    }

    private function buildMonthlyRevenueFromRooms($rooms): array
    {
        $months = collect(range(5, 0))->map(function ($offset) {
            return Carbon::now()->subMonths($offset)->startOfMonth();
        })->push(Carbon::now()->startOfMonth());

        $currentPaidRevenue = (float) $rooms
            ->where('payment_status', 'paid')
            ->sum('monthly_rent');

        return $months->map(function (Carbon $monthStart) use ($currentPaidRevenue) {
            $isCurrentMonth = $monthStart->isSameMonth(Carbon::now());

            return [
                'month' => $monthStart->format('M'),
                'revenue' => $isCurrentMonth ? $currentPaidRevenue : 0,
            ];
        })->values()->all();
    }

    private function averageMonthlyGrowth(array $monthlyRevenue): float
    {
        $growths = [];

        for ($i = 1; $i < count($monthlyRevenue); $i++) {
            $previous = $monthlyRevenue[$i - 1]['revenue'];
            $current = $monthlyRevenue[$i]['revenue'];

            if ($previous != 0) {
                $growths[] = (($current - $previous) / abs($previous)) * 100;
            }
        }

        if (empty($growths)) {
            return 0;
        }

        return round(array_sum($growths) / count($growths), 1);
    }

    private function filterToExistingRoomColumns(array $payload): array
    {
        return array_intersect_key($payload, array_flip($this->getRoomColumns()));
    }

    private function getRoomColumns(): array
    {
        return Schema::getColumnListing('rooms');
    }


    private function resolvePaymentOwnerId(?int $ownerId): ?int
    {
        if (empty($ownerId)) {
            return null;
        }

        return User::query()->whereKey($ownerId)->exists() ? $ownerId : null;
    }

    private function normalizeEmptyStringsToNull(Request $request, array $fields): void
    {
        $normalized = [];

        foreach ($fields as $field) {
            if ($request->has($field) && $request->input($field) === '') {
                $normalized[$field] = null;
            }
        }

        if (!empty($normalized)) {
            $request->merge($normalized);
        }
    }
}