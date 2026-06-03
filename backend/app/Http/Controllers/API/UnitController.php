<?php

namespace App\Http\Controllers\API;

use App\Models\Unit;
use App\Models\Property;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class UnitController extends Controller
{
    /**
     * Display a listing of all units.
     */
    public function index()
{
    // Eager load 'bookings' so the frontend can see the status
    $units = Unit::with(['property', 'bookings'])->latest()->get();
    $units = Unit::all();
    
    return response()->json([
        'message' => 'Units retrieved successfully',
        'data' => $units
    ]);
}

    /**
     * Display the specified unit profile details (GET api/units/{id}).
     */
    // app/Http/Controllers/API/UnitController.php

public function show($id)
{
    // Eager load property, the owner, and the reviews with their authors
    $unit = Unit::with(['property.user', 'reviews.user'])->find($id);

    if (!$unit) {
        return response()->json([
            'message' => 'Room or Unit profile not found'
        ], 404);
    }

    return response()->json([
        'message' => 'Unit details retrieved successfully',
        'data' => $unit
    ], 200);
}
    /**
     * Store a newly created unit.
     */
    public function store(Request $request)
    {
        if (!in_array(Auth::user()->role, ['admin', 'owner'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Aligned perfectly with your database migration layout fields
        $validated = $request->validate([
            'property_id'        => 'required|exists:properties,id',
            'tittle'             => 'required|string|max:250',
            'descrepton'         => 'nullable|string',
            'floor'              => 'nullable|string',
            'status'             => 'required|in:available,unavailable',
            'price_type'         => 'required|in:month,year,day',
            'price'              => 'required|numeric',
            'residential_water'  => 'nullable|string',
            'electricity_prices' => 'nullable|string',
            'bed'                => 'nullable|string',
            'max_member'         => 'nullable|string',
            'image'              => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $property = Property::findOrFail($validated['property_id']);
        if (Auth::user()->role !== 'admin' && $property->user_id !== Auth::id()) {
            return response()->json(['message' => 'You do not own this property'], 403);
        }

        // Handle Image Upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('units', 'public');
        }

        $unit = Unit::create($validated);

        return response()->json(['message' => 'Unit created successfully', 'data' => $unit], 201);
    }

    /**
     * Update the specified unit.
     */
    public function update(Request $request, $id)
    {
        $unit = Unit::findOrFail($id);
        $property = Property::find($unit->property_id);

        if (Auth::user()->role !== 'admin' && $property->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized assignment changes'], 403);
        }

        // Validating the actual attributes matching migration keys
        $validated = $request->validate([
            'tittle'             => 'sometimes|string|max:250',
            'descrepton'         => 'nullable|string',
            'floor'              => 'nullable|string',
            'status'             => 'sometimes|in:available,unavailable',
            'price_type'         => 'sometimes|in:month,year,day',
            'price'              => 'sometimes|numeric',
            'residential_water'  => 'nullable|string',
            'electricity_prices' => 'nullable|string',
            'bed'                => 'nullable|string',
            'max_member'         => 'nullable|string',
            'image'              => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        // Handle Image Replacement
        if ($request->hasFile('image')) {
            if ($unit->image) {
                Storage::disk('public')->delete($unit->image);
            }
            $validated['image'] = $request->file('image')->store('units', 'public');
        }

        $unit->update($validated);

        return response()->json(['message' => 'Unit updated successfully', 'data' => $unit]);
    }

    /**
     * Remove the specified unit.
     */
    public function destroy($id)
    {
        $unit = Unit::findOrFail($id);
        $property = Property::find($unit->property_id);

        if (Auth::user()->role !== 'admin' && $property->user_id !== Auth::id()) {
            return response()->json(['message' => 'Not your unit'], 403);
        }

        if ($unit->image) {
            Storage::disk('public')->delete($unit->image);
        }

        $unit->delete();
        return response()->json(['message' => 'Unit deleted successfully']);
    }

    /**
     * Search parameters for internal units mapping profiles.
     */
    public function search(Request $request)
    {
        $query = $request->get('q');
        $location = $request->get('location');
    
        // 1. Initialise via query() to prevent Intelephense deprecation warnings
        $units = Unit::query()
            ->with(['property', 'bookings'])
            
            // 2. Hide rooms that have an active, confirmed booking status
            ->whereDoesntHave('bookings', function($bQuery) {
                $bQuery->where('status', 'confirmed');
            })
            
            // 3. Apply conditional search filters
            ->where(function($q) use ($query, $location) {
                if ($query) {
                    $q->where('tittle', 'LIKE', "%{$query}%")
                      ->orWhere('descrepton', 'LIKE', "%{$query}%");
                }
                
                if ($location) {
                    // If query already added conditions, use orWhereHas, otherwise use whereHas
                    $q->orWhereHas('property', function($pq) use ($location) {
                        $pq->where('location', 'LIKE', "%{$location}%");
                    });
                }
            })
            ->limit(10)
            ->get() // Correctly resolved type-hinting target line
            
            // 4. Map output to conform to your frontend autocompletion structure
            ->map(fn($unit) => [
                'id' => $unit->id,
                'title' => $unit->tittle, // Keeps your custom database mapping intact
                'location' => $unit->property->location ?? 'N/A',
                'detail' => $unit->price . '$',
                'link' => "/dashboard/user/rooms/{$unit->id}"
            ]);
    
        return response()->json($units);
    }
}