<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Unit extends Model
{
    use HasFactory;

    protected $fillable = [
        'tittle',
        'descrepton',
        'user_id',
        'property_id',
        'image',
        'floor',
        'status',
        'price_type',
        'residential_water',
        'electricity_prices',
        'price',
        'bed',
        'max_member',
    ];

    /*
    |-----------------------------
    | Relationships
    |-----------------------------
    */

    // Unit belongs to User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class, 'property_id');
    }
    public function bookings()
    {
        return $this->hasMany(Booking::class, 'unit_id');
    }
    public function reviews()
{
    return $this->hasMany(Review::class);
}

public function averageRating()
{
    return round($this->reviews()->avg('rating'), 1) ?? 0;
}
}