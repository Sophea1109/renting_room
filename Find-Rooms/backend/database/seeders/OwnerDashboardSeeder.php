<?php


namespace Database\Seeders;

use App\Models\Room;
use App\Models\RoomPayment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class OwnerDashboardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $owner = User::firstOrCreate(
            ['email' => 'owner@example.com'],
            [
                'name' => 'Demo Owner',
                'password' => bcrypt('password'),
                'role' => 'owner',
            ]
        );

        $rooms = collect([
            ['name' => 'R-101', 'monthly_rent' => 650, 'occupancy_status' => 'occupied', 'payment_status' => 'paid'],
            ['name' => 'R-102', 'monthly_rent' => 720, 'occupancy_status' => 'occupied', 'payment_status' => 'paid'],
            ['name' => 'R-103', 'monthly_rent' => 750, 'occupancy_status' => 'available', 'payment_status' => 'unpaid'],
            ['name' => 'R-104', 'monthly_rent' => 810, 'occupancy_status' => 'occupied', 'payment_status' => 'paid'],
        ])->map(function ($roomData) use ($owner) {
            return Room::updateOrCreate(
                ['owner_id' => $owner->id, 'name' => $roomData['name']],
                [
                    'monthly_rent' => $roomData['monthly_rent'],
                    'occupancy_status' => $roomData['occupancy_status'],
                    'payment_status' => $roomData['payment_status'],
                ]
            );
        });

        $payments = [
            ['room' => 'R-101', 'amount' => 650, 'monthsAgo' => 2],
            ['room' => 'R-102', 'amount' => 720, 'monthsAgo' => 2],
            ['room' => 'R-104', 'amount' => 810, 'monthsAgo' => 1],
            ['room' => 'R-101', 'amount' => 650, 'monthsAgo' => 0],
        ];

        foreach ($payments as $entry) {
            $room = $rooms->firstWhere('name', $entry['room']);
            if (!$room) {
                continue;
            }

            $paidAt = Carbon::now()->subMonths($entry['monthsAgo'])->startOfMonth()->addDays(5);

            RoomPayment::firstOrCreate([
                'room_id' => $room->id,
                'owner_id' => $owner->id,
                'amount' => $entry['amount'],
                'paid_at' => $paidAt->toDateString(),
            ]);
        }
    }
}