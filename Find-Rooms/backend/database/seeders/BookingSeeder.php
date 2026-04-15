<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        $owner = User::where('email', 'owner@example.com')->first();

        if (!$owner) {
            return;
        }

        $rooms = Room::where('owner_id', $owner->id)->get();

        if ($rooms->isEmpty()) {
            return;
        }

        $tenants = [
            ['name' => 'John Smith',   'email' => 'john@example.com'],
            ['name' => 'Emma Johnson', 'email' => 'emma@example.com'],
            ['name' => 'Mike Chen',    'email' => 'mike@example.com'],
            ['name' => 'Sarah Wilson', 'email' => 'sarah@example.com'],
            ['name' => 'David Brown',  'email' => 'david@example.com'],
        ];

        $bookings = [
            // Pending bookings (owner needs to act on these)
            [
                'room'         => 'R-101',
                'tenant'       => $tenants[0],
                'start_date'   => '2026-05-01',
                'end_date'     => '2026-05-31',
                'total_amount' => 650,
                'status'       => 'pending',
            ],
            [
                'room'         => 'R-102',
                'tenant'       => $tenants[1],
                'start_date'   => '2026-05-01',
                'end_date'     => '2026-06-30',
                'total_amount' => 1440,
                'status'       => 'pending',
            ],
            [
                'room'         => 'R-101',
                'tenant'       => $tenants[2],
                'start_date'   => '2026-05-01',
                'end_date'     => '2026-05-31',
                'total_amount' => 650,
                'status'       => 'pending',
            ],
            // Approved booking
            [
                'room'         => 'R-103',
                'tenant'       => $tenants[3],
                'start_date'   => '2026-04-01',
                'end_date'     => '2026-04-30',
                'total_amount' => 750,
                'status'       => 'approved',
            ],
            // Rejected booking
            [
                'room'         => 'R-104',
                'tenant'       => $tenants[4],
                'start_date'   => '2026-04-01',
                'end_date'     => '2026-04-30',
                'total_amount' => 810,
                'status'       => 'rejected',
            ],
        ];

        foreach ($bookings as $data) {
            $room = $rooms->firstWhere('name', $data['room']);

            if (!$room) {
                continue;
            }

            Booking::firstOrCreate(
                [
                    'room_id'      => $room->id,
                    'tenant_email' => $data['tenant']['email'],
                    'start_date'   => $data['start_date'],
                ],
                [
                    'owner_id'     => $owner->id,
                    'tenant_name'  => $data['tenant']['name'],
                    'end_date'     => $data['end_date'],
                    'total_amount' => $data['total_amount'],
                    'status'       => $data['status'],
                ]
            );
        }
    }
}
