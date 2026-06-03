<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserReport extends Model
{
    protected $fillable = ['reported_by', 'user_id', 'reason', 'details', 'status'];
    
    public function user() {
        return $this->belongsTo(User::class);
    }
};