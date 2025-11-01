<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeleconsultRoom extends Model
{
    protected $fillable = [
        'room_id',
        'doctor_id',
        'patient_id',
        'status',
        'started_at',
        'ended_at'
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }
    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }
}
