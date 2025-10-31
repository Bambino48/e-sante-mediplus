<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

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

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    /**
     * ✅ Relation : un utilisateur (doctor) possède un profil médecin
     */
    public function doctorProfile()
    {
        return $this->hasOne(DoctorProfile::class, 'user_id', 'id');
    }

    /**
     * ✅ Vérifie si l’utilisateur est un médecin
     */
    public function isDoctor(): bool
    {
        return $this->role === 'doctor';
    }

    /**
     * ✅ Vérifie si l’utilisateur est un patient
     */
    public function isPatient(): bool
    {
        return $this->role === 'patient';
    }

    /**
     * ✅ Vérifie si l’utilisateur est un administrateur
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
