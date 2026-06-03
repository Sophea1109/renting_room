<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Booking;
use Illuminate\Http\Request;
use App\Models\ReviewReport;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'rating'      => 'required|integer|min:1|max:5',
            'comment'     => 'nullable|string|max:1000',
            'property_id' => 'required_without:unit_id|exists:properties,id',
            'unit_id'     => 'required_without:property_id|exists:units,id',
        ]);

        $userId = auth()->id() ?? 1; // Fallback helper ID for Postman testing

        // --- Rating Policy Check ---
        // Verifies if the user actually stayed here before letting them leave a review
        $hasBooked = Booking::where('user_id', $userId)
            ->where('status', 'confirmed')
            ->where(function ($query) use ($request) {
                if ($request->unit_id) {
                    $query->where('unit_id', $request->unit_id);
                } else {
                    $query->where('property_id', $request->property_id);
                }
            })->exists();

        if (!$hasBooked) {
            return response()->json([
                'status' => 'error',
                'message' => 'Policy Restriction: You can only rate properties or units you have successfully booked and stayed at.'
            ], 403);
        }

        // Save the review
        $review = Review::create([
            'user_id'     => $userId,
            'property_id' => $request->property_id,
            'unit_id'     => $request->unit_id,
            'rating'      => $request->rating,
            'comment'     => $request->comment,
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Thank you for your feedback! Your review has been published.',
            'data'    => $review
        ], 201);
    }
    public function report(Request $request, $reviewId)
{
    $request->validate([
        'reason' => 'required|string|max:255', // e.g., "Abusive language", "False Information"
        'details' => 'nullable|string|max:1000'
    ]);

    $review = Review::with(['unit.property', 'property'])->findOrFail($reviewId);
    $userId = auth()->id() ?? 2; // Fallback helper ID (Owner ID) for Postman testing

    // --- Ownership Policy Validation ---
    // Check if the review belongs to a unit or property owned by this user
    $isRealOwner = false;

    if ($review->unit && $review->unit->property->user_id == $userId) {
        $isRealOwner = true;
    } elseif ($review->property && $review->property->user_id == $userId) {
        $isRealOwner = true;
    }

    if (!$isRealOwner) {
        return response()->json([
            'status' => 'error',
            'message' => 'Policy Restriction: You can only report reviews submitted to your own listings.'
        ], 403);
    }

    // Prevent duplicate reports for the same review by the same owner
    $alreadyReported = ReviewReport::where('user_id', $userId)
        ->where('review_id', $reviewId)
        ->exists();

    if ($alreadyReported) {
        return response()->json([
            'status' => 'error',
            'message' => 'You have already submitted a investigation report for this review.'
        ], 422);
    }

    // Save the report case file for the platform admin dashboard
    $report = ReviewReport::create([
        'user_id' => $userId,
        'review_id' => $reviewId,
        'reason' => $request->reason,
        'details' => $request->details,
    ]);

    return response()->json([
        'status' => 'success',
        'message' => 'Review flagged successfully. System administrators will audit this comment shortly.',
        'report_details' => $report
    ], 201);
}
}