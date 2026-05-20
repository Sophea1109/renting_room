<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\API\PropertyController;
use App\Http\Controllers\API\UnitController;
use App\Http\Controllers\API\BookingController;
use App\Http\Controllers\API\PaymentController;


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
| AUTH USER (PROTECTED)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user', [AuthController::class, 'updateProfile']);

    Route::post('/user/avatar', [UserController::class, 'uploadAvatar']);
    Route::get('/user/avatar/{id}', [UserController::class, 'getAvatar']);

    // CHAT
    Route::get('/chat/users', [ChatController::class, 'users']);
    Route::get('/chat/messages/{id}', [ChatController::class, 'messages']);
    Route::post('/chat/send', [ChatController::class, 'send']);
    Route::put('/messages/read/{id}', [ChatController::class, 'markAsRead']);
    Route::get('/messages/unread', [ChatController::class, 'unreadMessages']);

    // USERS
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    Route::post('/properties', [PropertyController::class, 'store']);
    Route::post('/units', [UnitController::class, 'store']);

    //booking management
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::get('/bookings/{booking}', [BookingController::class, 'show']);
    Route::put('/bookings/{booking}/approve', [BookingController::class, 'approved']);
    Route::put('/bookings/{booking}/reject', [BookingController::class, 'reject']);
    Route::put('/bookings/{booking}/cancel', [BookingController::class, 'cancelled']);

    //payment
    Route::post('/payments/{booking}/pay', [PaymentController::class, 'payNow']);
    Route::put('/payments/{payment}/verify', [PaymentController::class, 'verify']);
    Route::get('/payments/history', [PaymentController::class, 'history']);
    Route::get('/payments/owner', [PaymentController::class, 'ownerPayment']);
});