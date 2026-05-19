<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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

    // Unit belongs to Property
    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}