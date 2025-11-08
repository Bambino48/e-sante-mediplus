<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Consultation extends Model
{
    protected $fillable = [
        'patient_id',
        'doctor_id',
        'appointment_id',
        'teleconsult_room_id',
        'consultation_date',
        'symptoms',
        'diagnosis',
        'notes',
        'status'
    ];

    protected $casts = [
        'consultation_date' => 'datetime',
    ];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    public function teleconsultRoom()
    {
        return $this->belongsTo(TeleconsultRoom::class);
    }
}
