<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'first_name',
        'last_name',
        'telegram_id',
        'telegram_phone_number',
        'email',
        'password',
        'role',
        'gender',
        'avatar',
        'bio',
        'otp',
        'otp_expire_at',
        'payment_gateway_merchant_id',
        
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'otp',
        'otp_expire_at',
    ];

    protected $casts = [
        'otp_expire_at' => 'datetime',
        'is_online' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONSHIPS
    |--------------------------------------------------------------------------
    */

    // Sent messages
    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    // Received messages
    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }


public function isAdmin()
{
    return $this->role === 'admin';
}

public function isOwner()
{
    return $this->role === 'owner';
}

public function isUser()
{
    return $this->role === 'user';
}
}