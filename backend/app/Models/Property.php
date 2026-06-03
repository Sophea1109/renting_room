<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'user_id',
        'property_type_id',
        'image',
        'star_rating',
        'floor',
        'have_gym',
        'have_swing',
        'have_park',
    ];

    protected $casts = [
        'star_rating' => 'decimal:1',
        'have_gym' => 'boolean',
        'have_swing' => 'boolean',
        'have_park' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function propertyType()
    {
        return $this->belongsTo(PropertyType::class);
    }

    public function units()
    {
        return $this->hasMany(Unit::class);
    }

    public function booking()
    {
        return $this->hasMany(Booking::class);
    }
    public function reviews()
{
    return $this->hasMany(Review::class);
}

// Helper to calculate average rating automatically
public function averageRating()
{
    return round($this->reviews()->avg('rating'), 1) ?? 0;
}
}