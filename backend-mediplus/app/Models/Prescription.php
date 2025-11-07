<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prescription extends Model
{
    protected $fillable = [
        'doctor_id',
        'patient_id',
        'appointment_id',
        'content',
        'pdf_path'
    ];

    protected $casts = [
        'content' => 'array',
    ];

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

    /**
     * Relation : Une prescription a plusieurs médicaments
     */
    public function medications()
    {
        return $this->hasMany(Medication::class);
    }
}
