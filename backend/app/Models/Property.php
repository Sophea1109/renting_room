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
        'price',
        'price_type',
        'has_units',
        'tittle',
        'descrepton',
        'bedrooma',
        'has_kitchen',
        'size_house',
        'bathroom',
    ];

    protected $casts = [
        'star_rating' => 'decimal:1',
        'price' => 'decimal:2',
        'size_house' => 'decimal:2',

        'have_gym' => 'boolean',
        'have_swing' => 'boolean',
        'have_park' => 'boolean',
        'has_units' => 'boolean',
        'has_kitchen' => 'boolean',
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
}