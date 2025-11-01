<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prescription extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctor_id',
        'patient_id',
        'appointment_id',
        'medications',
        'notes',
        'issued_at',
        'expires_at',
    ];

    protected $casts = [
        'medications' => 'json',
        'issued_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    // Relations
    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    // Accesseurs
    public function getIsExpiredAttribute()
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function getIsValidAttribute()
    {
        return !$this->is_expired;
    }
}
