<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * Public room listing for tenants.
     * GET /api/rooms
     */
    public function index(Request $request)
    {
        $query = Room::with('owner')->where('type', '!=', 'hotel');

        // Search by name or description
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by location
        if ($request->has('location') && $request->location) {
            $query->where('location', $request->location);
        }

        // Filter by min price
        if ($request->has('min_price') && $request->min_price) {
            $query->where('monthly_rent', '>=', $request->min_price);
        }

        // Filter by max price
        if ($request->has('max_price') && $request->max_price) {
            $query->where('monthly_rent', '<=', $request->max_price);
        }

        $rooms = $query->get()->map(fn($room) => $this->formatRoom($room));

        return response()->json(['rooms' => $rooms]);
    }

    /**
     * Single room detail for tenants.
     * GET /api/rooms/{id}
     */
    public function show(Room $room)
    {
        return response()->json($this->formatRoom($room->load('owner')));
    }

    /**
     * Format a room for the frontend.
     */
    private function formatRoom(Room $room): array
    {
        $images = $room->images ?? [];
        $firstImage = count($images) > 0 ? $images[0] : '/images/rest1.jpg';

        return [
            'id'           => $room->id,
            'title'        => $room->name,
            'description'  => $room->description ?? 'A comfortable room available for rent.',
            'location'     => $room->location ?? 'Location not specified',
            'price'        => '$' . number_format($room->monthly_rent, 0) . '/mo',
            'monthly_rent' => (float) $room->monthly_rent,
            'image'        => $firstImage,
            'images'       => $images,
            'amenities'    => $room->amenities ?? [],
            'type'         => $room->type,
            'beds'         => $room->beds,
            'baths'        => $room->baths,
            'size'         => $room->size,
            'room_number'      => $room->room_number,
            'occupancy_status' => $room->occupancy_status,
            'owner_id'         => $room->owner_id,
            'owner' => [
                'name'    => $room->owner?->name ?? 'Owner',
                'avatar'  => '/users/default-avatar.svg',
                'contact' => $room->contact_email ?? $room->owner?->email ?? '',
            ],
        ];
    }
}
