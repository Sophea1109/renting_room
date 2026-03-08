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
        //laravel get data from database based on the request URL (owner_id)
        $ownerId = $request->query('owner_id');
    
        //query: SELECT * FROM 
        $roomsQuery = Room::query();
        $paymentsQuery = RoomPayment::query();

        //read URL (owner_id) and stored in $ownerId
        //owner_id = 1 => $ownerId = 1
        if ($ownerId) { 
            $roomsQuery->where('owner_id', $ownerId);
            $paymentsQuery->where('owner_id', $ownerId);
        }

        //execute
        $rooms = $roomsQuery->orderBy('id')->get();
        $payments = $paymentsQuery->get();

        //count rooms (available, occupied)
        $totalRooms = $rooms->count(); 
        $occupiedRooms = $rooms->where('occupancy_status', 'occupied')->count();
        $availableRooms = $rooms->where('occupancy_status', 'available')->count();
        $totalRevenue = (float) $payments->sum('amount'); //sum
        $occupancyRate = $totalRooms > 0 ? round(($occupiedRooms / $totalRooms) * 100, 1) : 0;

        $monthlyRevenue = $this->buildMonthlyRevenue($payments);
        $averageMonthlyGrowth = $this->averageMonthlyGrowth($monthlyRevenue);

        return response()->json([
            //variable 
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
            //fetch data from database, select specific column
            'rooms' => $rooms->map(function (Room $room) {
                return [
                    'id' => $room->id,
                    'name' => $room->name,
                    'monthlyRent' => (float) $room->monthly_rent,
                    'occupancyStatus' => $room->occupancy_status,
                    'paymentStatus' => $room->payment_status,
                ];
            })->values(),
        ]);
    }

    public function updateRoomStatus(Request $request, Room $room): JsonResponse
    {
        //validate when user send, after validation, stored in $validated
        $validated = $request->validate([
            'occupancy_status' => 'sometimes|in:available,occupied',
            'payment_status' => 'sometimes|in:paid,unpaid',
            'paid_at' => 'nullable|date', //optional (nullable)
        ]);

        //stored previous payment before change/use only in roompayment create table
        $previousPaymentStatus = $room->payment_status;

        //update occupacy and payment status, update when user sent
        if (array_key_exists('occupancy_status', $validated)) {
            $room->occupancy_status = $validated['occupancy_status'];
        }

        if (array_key_exists('payment_status', $validated)) {
            $room->payment_status = $validated['payment_status'];
        }

        //database update
        $room->save();

        //user send request, not yet paid, payment status is paid
        if (
            array_key_exists('payment_status', $validated)
            && $previousPaymentStatus !== 'paid'
            && $validated['payment_status'] === 'paid'
        ) { //execute if all condition met
            RoomPayment::create([
                'room_id' => $room->id,
                'owner_id' => $room->owner_id,
                'amount' => $room->monthly_rent,
                'paid_at' => $validated['paid_at'] ?? Carbon::today()->toDateString(),//today's date
            ]);
        }

        return response()->json([
            'message' => 'Room status updated successfully',
            'room' => [
                'id' => $room->id,
                'name' => $room->name,
                'occupancyStatus' => $room->occupancy_status,
                'paymentStatus' => $room->payment_status,
            ],
        ]);
    }

    //monthly revenue from the last 6 months (include the current month)
    //stored in $monthlyRevenue after
    private function buildMonthlyRevenue($payments): array
    {
        //map: loop through each offset and return each one
        $months = collect(range(5, 0))->map(function ($offset) {
            return Carbon::now()->subMonths($offset)->startOfMonth();
        })->push(Carbon::now()->startOfMonth());

        //calculate the start-end of month
        //copy(): change original data without it
        return $months->map(function (Carbon $monthStart) use ($payments) {
            $monthEnd = $monthStart->copy()->endOfMonth();
            //show collection of payment inside $payment
            $monthTotal = (float) $payments
                ->whereBetween('paid_at', [$monthStart->toDateString(), $monthEnd->toDateString()])
                ->sum('amount');

            return [
                'month' => $monthStart->format('M'), //month
                'revenue' => $monthTotal,
            ];
            //reset index and convert to php array
        })->values()->all();
    }

    private function averageMonthlyGrowth(array $monthlyRevenue): float
    {
        $growths = []; //empty array to store growth percentage 

        //compare previous and current month
        for ($i = 1; $i < count($monthlyRevenue); $i++) {
            $previous = $monthlyRevenue[$i - 1]['revenue']; //0-1
            $current = $monthlyRevenue[$i]['revenue']; //1

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