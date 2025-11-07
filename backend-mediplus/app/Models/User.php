<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, HasFactory;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'photo',
        'latitude',
        'longitude',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    protected $appends = ['photo_url'];

    // Accesseur pour l'URL complète de la photo
    public function getPhotoUrlAttribute()
    {
        if ($this->photo) {
            return asset('storage/' . $this->photo);
        }
        return null;
    }

    // Relations
    public function doctorProfile()
    {
        return $this->hasOne(DoctorProfile::class, 'user_id', 'id');
    }

    public function specialties()
    {
        return $this->belongsToMany(Specialty::class, 'doctor_specialty', 'doctor_id', 'specialty_id');
    }

    public function availabilities()
    {
        return $this->hasMany(Availability::class, 'doctor_id');
    }

    public function doctorAppointments()
    {
        return $this->hasMany(Appointment::class, 'doctor_id');
    }

    public function patientAppointments()
    {
        return $this->hasMany(Appointment::class, 'patient_id');
    }

    public function notificationsCustom()
    {
        return $this->hasMany(NotificationCustom::class);
    }

    // Helpers
    public function isDoctor(): bool
    {
        return $this->role === 'doctor';
    }
    public function isPatient(): bool
    {
        return $this->role === 'patient';
    }
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
    public function patientProfile()
    {
        return $this->hasOne(PatientProfile::class, 'user_id', 'id');
    }
}
