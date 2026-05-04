<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'owner_name',
        'room_number',
        'name',
        'type',
        'monthly_rent',
        'beds',
        'baths',
        'size',
        'description',
        'location',
        'contact_email',
        'amenities',
        'images',
        'occupancy_status',
        'payment_status',
    ];

    protected $casts = [
        'amenities' => 'array',
        'images'    => 'array',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(RoomPayment::class);
    }
}
