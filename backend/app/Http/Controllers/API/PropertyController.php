<?php

namespace App\Http\Controllers\API;

use App\Models\Property;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class PropertyController extends Controller
{
    /**
     * GET ALL PROPERTIES
     */
    public function index(Request $request)
{
    $properties = Property::with(['units', 'propertyType', 'user']) // 'user' is required
    ->latest()
    ->get();
    $query = Property::with(['units', 'propertyType', 'user']);
    $user = $request->user(); // Use this instead of Auth::user()

    // Logic:
    // 1. If user is logged in AND is not admin -> Filter by user_id
    // 2. If user is logged in AND is admin -> Do not filter (get all)
    if ($user && $user->role !== 'admin') {
        $query->where('user_id', $user->id);
    } elseif (!$user) {
        // Optional: Return unauthorized if no token was provided
        return response()->json(['message' => 'Unauthenticated'], 401);
    }
    
    $properties = $query->latest()->get();

    return response()->json([
        'message' => 'Properties retrieved successfully',
        'data' => $properties
    ]);
}
    /**
     * GET SINGLE PROPERTY
     */
    public function show($id)
    {
        $property = Property::with(['units', 'propertyType', 'user'])
            ->findOrFail($id);

        return response()->json([
            'message' => 'Property detail',
            'data' => $property
        ]);
    }

    /**
     * CREATE PROPERTY
     */
    public function store(Request $request)
    {
        // Only admin and owner are allowed access
        if (!in_array(Auth::user()->role, ['admin', 'owner'])) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'name'             => 'required|string',
            'location'         => 'required|string',
            'property_type_id' => 'required|exists:property_types,id',
            'image'            => 'nullable|string',
            'star_rating'      => 'nullable|numeric',
            'floor'            => 'nullable|integer',
            'have_gym'         => 'boolean',
            'have_swing'       => 'boolean',
            'have_park'        => 'boolean',
            'price'            => 'required|numeric',
            'price_type'       => 'required|in:month,year,day',
            'has_units'        => 'boolean',
            'tittle'           => 'required|string',
            'descrepton'       => 'nullable|string',
            'bedrooma'         => 'required|string',
            'has_kitchen'      => 'boolean',
            'size_house'       => 'nullable|numeric',
            'bathroom'         => 'required|string',

            // PAYMENT POLICY
            'payment_policy'   => 'required|in:pay_first,pay_later',
        ]);

        // Bind property to logged-in owner
        $validated['user_id'] = Auth::id();

        $property = Property::create($validated);

        return response()->json([
            'message' => 'Property created successfully',
            'data' => $property
        ], 201);
    }

    /**
     * UPDATE PROPERTY
     */
    public function update(Request $request, $id)
    {
        $property = Property::findOrFail($id);

        // Only admin and owner are allowed access
        if (!in_array(Auth::user()->role, ['admin', 'owner'])) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        // Owners can only edit their own properties
        if (
            Auth::user()->role !== 'admin' &&
            $property->user_id !== Auth::id()
        ) {
            return response()->json([
                'message' => 'Not your property'
            ], 403);
        }

        $validated = $request->validate([
            'name'             => 'sometimes|string',
            'location'         => 'sometimes|string',
            'property_type_id' => 'sometimes|exists:property_types,id',
            'image'            => 'nullable|string',
            'star_rating'      => 'nullable|numeric',
            'floor'            => 'nullable|integer',
            'have_gym'         => 'boolean',
            'have_swing'       => 'boolean',
            'have_park'        => 'boolean',
            'price'            => 'sometimes|numeric',
            'price_type'       => 'sometimes|in:month,year,day',
            'has_units'        => 'boolean',
            'tittle'           => 'sometimes|string',
            'descrepton'       => 'nullable|string',
            'bedrooma'         => 'nullable|string',
            'has_kitchen'      => 'boolean',
            'size_house'       => 'nullable|numeric',
            'bathroom'         => 'nullable|string',

            // PAYMENT POLICY
            'payment_policy'   => 'sometimes|in:pay_first,pay_later',
        ]);

        $property->update($validated);

        return response()->json([
            'message' => 'Property updated successfully',
            'data' => $property
        ]);
    }

    /**
     * DELETE PROPERTY
     */
    public function destroy($id)
    {
        $property = Property::findOrFail($id);

        // Only admin and owner are allowed access
        if (!in_array(Auth::user()->role, ['admin', 'owner'])) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        // Owners can only delete their own properties
        if (
            Auth::user()->role !== 'admin' &&
            $property->user_id !== Auth::id()
        ) {
            return response()->json([
                'message' => 'Not your property'
            ], 403);
        }

        $property->delete();

        return response()->json([
            'message' => 'Property deleted successfully'
        ]);
    }
}