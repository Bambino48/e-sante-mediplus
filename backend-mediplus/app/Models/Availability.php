<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Availability extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctor_id',
        'date',
        'start_time',
        'end_time',
        'max_patients',
    ];

    protected $casts = [
        'date' => 'date',
        'max_patients' => 'integer',
    ];

    // Relations
    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    // Accesseurs
    public function getAvailableSlotsAttribute()
    {
        return $this->max_patients - $this->appointments()->count();
    }

    public function getIsFullAttribute()
    {
        return $this->available_slots <= 0;
    }
}
