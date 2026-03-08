<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoomPayment extends Model
{
    //can create fake payment data for testing
    use HasFactory;

    //should add tenent id?
    //as long as room_id is not affected, i think its ok?
    //right now, we only know what room that have made the payment
    protected $fillable = [
        'room_id',
        'owner_id',
        'amount',
        'paid_at',
    ];

    //convert database value into specific data type
    protected $casts = [
        'paid_at' => 'date',
    ];

    //each payment belong to one room
    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    //each payment belong to one owner
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}