<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DoctorProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctor_id',
        'specialty',
        'bio',
        'license_number',
        'experience_years',
        'consultation_fee',
        'avatar_url',
        'verified',
    ];

    protected $casts = [
        'verified' => 'boolean',
        'experience_years' => 'integer',
        'consultation_fee' => 'decimal:2',
    ];

    // Relations
    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function specialty()
    {
        return $this->belongsTo(Specialty::class, 'specialty', 'name');
    }
}
