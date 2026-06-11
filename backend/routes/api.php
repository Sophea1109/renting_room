<?php

use App\Models\Booking;

use App\Models\UserReport;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\API\UnitController;
use App\Http\Controllers\API\PropertyController;
use App\Http\Controllers\API\PropertyTypeController;

/*
|--------------------------------------------------------------------------
| AUTH ROUTES (PUBLIC)
|--------------------------------------------------------------------------
*/
Route::post('/send-otp', [AuthController::class, 'sendOtp']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/check-telegram', [AuthController::class, 'checkTelegram']);
Route::post('/forgot-password', [AuthController::class, 'sendResetOtp']);
Route::post('/verify-reset', [AuthController::class, 'verifyResetOtp']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

/*
|--------------------------------------------------------------------------
| PUBLIC PROPERTY & UNIT BROWSING ROUTES
|--------------------------------------------------------------------------
*/
Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{id}', [PropertyController::class, 'show']);
Route::get('/units', [UnitController::class, 'index']);

/*
|--------------------------------------------------------------------------
| PUBLIC PAYMENT GATEWAY CHANNELS (Moved Outside Sanctum)
|--------------------------------------------------------------------------
*/
// payment mock: Accessible via browser redirect without custom bearer tokens
Route::get('/payment/gateway/{booking_id}', [PaymentController::class, 'showGateway']);

// The Payment Gateway Webhook Endpoint (Where the Visa processor pings back a status check)
Route::post('/payment/callback', [PaymentController::class, 'processCallback']);


/*
|--------------------------------------------------------------------------
| AUTH USER (PROTECTED VIA SANCTUM)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user', [AuthController::class, 'updateProfile']);

    Route::post('/user/avatar', [UserController::class, 'uploadAvatar']);
    Route::get('/user/avatar/{id}', [UserController::class, 'getAvatar']);

    // CHAT - Updated to be consistent
    Route::get('/chat/users', [ChatController::class, 'users']);
    Route::get('/chat/messages/{id}', [ChatController::class, 'messages']);
    Route::post('/chat/send', [ChatController::class, 'send']);
    Route::put('/messages/read/{id}', [ChatController::class, 'markAsRead']);

    Route::get('/unread-messages', [ChatController::class, 'unreadCount']);
    
    // USERS
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    
    Route::apiResource('property-types', PropertyTypeController::class);
    
    // Property
    Route::post('/properties', [PropertyController::class, 'store']);
    Route::put('/properties/{id}', [PropertyController::class, 'update']);
    Route::delete('/properties/{id}', [PropertyController::class, 'destroy']);
    Route::get('/properties', [PropertyController::class, 'index']);

    // Unit Secure Handlers
    Route::post('/units', [UnitController::class, 'store']);
    Route::post('/units/{id}', [UnitController::class, 'update']);
    Route::delete('/units/{id}', [UnitController::class, 'destroy']);
    
    // Move inside the Route::middleware('auth:sanctum')->group(function () { ... }) block:
    
    // Booking Handlers
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::get('/my-bookings', function () {
        return Booking::with('unit.property')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();
    });
    Route::put('/bookings/{id}/status', [BookingController::class, 'updateStatus']);
    Route::get('/my-bookings', [BookingController::class, 'myBookings']);
    Route::get('/owner/bookings', [BookingController::class, 'ownerBookings']);
    Route::post(
        '/bookings/{id}/confirm',
        [BookingController::class, 'confirmBooking']
    );

    Route::post(
        '/bookings/{id}/reject',
        [BookingController::class, 'rejectBooking']
    );
    Route::get('/owner/revenue', [BookingController::class, 'ownerRevenue']);
    
    // Payment Handlers (ADDED VISA SECURE CHECKOUT FOR NEXT.JS)
    Route::get('/payment/gateway/{booking_id}', [PaymentController::class, 'showGateway']);
    Route::post('/payment/visa-checkout', [PaymentController::class, 'processVisaCheckout']);
    
    // Reviews
    Route::get('/units/{id}/reviews', [ReviewController::class, 'index']); // Fetch reviews for a specific unit
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::post('/reviews/{id}/report', [ReviewController::class, 'report']);
    
    // routes/api.php

// 1. Add this route to fetch reports for the admin dashboard
Route::get('/admin/user-reports', function () {
    return response()->json([
        'data' => \App\Models\UserReport::with('user')->get() // Ensure you include the relationship
    ]);
})->middleware('auth:sanctum'); // Ensure the user is an admin here

// 2. This is the route you provided for submitting reports
Route::post('/report-user', function (Illuminate\Http\Request $request) {
    $request->validate([
        'user_id' => 'required|exists:users,id',
        'reason' => 'required|string|max:255',
        'details' => 'nullable|string'
    ]);
    
    $report = \App\Models\UserReport::create([
        'reported_by' => auth()->id() ?? 2, 
        'user_id' => $request->user_id,
        'reason' => $request->reason,
        'details' => $request->details,
    ]);
    
    return response()->json([
        'status' => 'success',
        'message' => 'User has been reported to administration successfully.',
        'data' => $report
    ], 201);
});
// Add this inside the auth:sanctum middleware block
Route::post('/admin/user-reports/{id}/action', [ReportController::class, 'handleAction']);

Route::get('/pending-count', function (Illuminate\Http\Request $request) {
    $ownerId = $request->query('owner_id');
    // If you need to filter by owner, add a 'where' clause here
    $count = \App\Models\UserReport::where('status', 'pending')->count();
    return response()->json(['count' => $count]);
});
});

/*
| PUBLIC UNIT ROUTES
*/
Route::get('/units/{id}', [UnitController::class, 'show']);
Route::get('/units/search', [UnitController::class, 'search']);
Route::get('/units/{id}/availability', [UnitController::class, 'availability']);
Route::middleware('auth:sanctum')->get('/admin/dashboard-stats', function () {
    return response()->json([
        'users' => \App\Models\User::count(),
        'rooms' => \App\Models\Unit::count(),
        'owners' => \App\Models\User::where('role', 'owner')->count(),
        'properties' => \App\Models\Property::count(),
    ]);
});