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
        'contact_email',
        'name',
        'location',
        'description',
        'image_url',
        'monthly_rent',
        'occupancy_status',
        'payment_status',
    ];

    //each room belong to different owner
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    //one room = many payment
    public function payments(): HasMany
    {
        return $this->hasMany(RoomPayment::class);
    }
}