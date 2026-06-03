<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReviewReport extends Model
{
    protected $fillable = ['user_id', 'review_id', 'reason', 'details', 'status'];

    public function review()
    {
        return $this->belongsTo(Review::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}