<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'unit_id',
        'user_id',
        'start_date',
        'end_date',
        'total_price',
        'status',
        'payment_type',
        'contract_paylater',
    ];

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function payment()
    {
        return $this->hasMany(Payment::class);
    }
    
    //generate booking ref first before creating the booking
    protected static function boot(){
        parent::boot();
        static::creating(function($booking){
            $booking->booking_ref = 'BK-' . strtoupper(substr(str_replace('-', '', \Illuminate\Support\Str::uuid()), 0, 8));
        });
    }
}
