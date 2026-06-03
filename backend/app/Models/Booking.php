<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'unit_id',
        'property_id',
        'status',
        'check_in',
        'check_out',
        'total',
    ];

    /**
     * Relationship: A booking has exactly one payment record.
     */
    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class, 'booking_id');
    }

    /**
     * Relationship: A booking belongs to a specific room unit.
     */
    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id');
    }
    /**
     * Relationship: A booking belongs to a wider property list.
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Relationship: A booking belongs to a guest user.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}