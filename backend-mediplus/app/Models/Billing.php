<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Billing extends Model
{
    protected $fillable = [
        'doctor_id',
        'period_start',
        'period_end',
        'total_amount',
        'paid_at'
    ];

    protected $casts = [
        'period_start' => 'date',
        'period_end' => 'date',
        'paid_at' => 'datetime',
    ];

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }
}
