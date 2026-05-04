<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use App\Models\Booking;

class HotelController extends Controller
{
    /**
     * Public hotel listing for tenants.
     * GET /api/hotels
     */
    public function index(Request $request)
    {
        $query = Room::with('owner')->where('type', 'hotel');

        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('location') && $request->location) {
            $query->where('location', $request->location);
        }

        $hotels = $query->get()->map(fn($room) => $this->formatHotel($room));

        return response()->json(['hotels' => $hotels]);
    }

    // public function store(Room $room, Request $request) {
    //     $validated = $request->validate([
    //         'room_id' => 'required|exists:rooms,id',
    //         'tenant_name' => 'required|string',
    //         'tenant_email' => 'required|email'
    //     ]);

    //     // can't book an already occupied room
    //     if ($room->occupancy_status === 'occupied') {
    //         return response()->json([
    //             'message' => 'This room is already occupied and not available for booking.',
    //         ], 422);
    //     }

    //     // show room that's been approve
    //     $HotelApprovedRoom = Booking::where('room_id', $room->id)->where('status', 'approved')->exists();
    //     if ($HotelApprovedRoom) {
    //         return response()->json(['message' => 'This room has been approve by the tenant!'], 422);
    //     }

    //     // avoid booking again after booking once
    //     $duplicateBooking = Booking::where('room_id', $room->id)->where('tenant_email', $validated['tenant_email'])->where('status', 'pending')->exists();
    //     if ($duplicateBooking) {
    //         return response()->json(['message' => 'This room is still pending, please wait.'], 422);
    //     }
    // }

    /**
     * Single hotel detail for tenants.
     * GET /api/hotels/{id}
     */
    public function show(Room $room)
    {
        if ($room->type !== 'hotel') {
            return response()->json(['message' => 'Hotel not found'], 404);
        }

        return response()->json($this->formatHotel($room->load('owner')));
    }

    private function formatHotel(Room $room): array
    {
        $images = $room->images ?? [];
        $firstImage = count($images) > 0 ? $images[0] : '/images/room1.jpg';

        return [
            'id'               => $room->id,
            'owner_id'         => $room->owner_id,
            'occupancy_status' => $room->occupancy_status,
            'name'             => $room->name,
            'location'         => $room->location ?? 'Location not specified',
            'price'            => '$' . number_format($room->monthly_rent, 0) . '/night',
            'monthly_rent'     => (float) $room->monthly_rent,
            'rating'           => 4.5,
            'image'            => $firstImage,
            'description'      => $room->description ?? 'A comfortable hotel stay.',
            'amenities'        => $room->amenities ?? [],
            'manager'          => [
                'name'    => $room->owner->name ?? 'Manager',
                'avatar'  => '/users/default-avatar.svg',
                'contact' => $room->contact_email ?? ($room->owner->email ?? ''),
            ],
        ];
    }
}
