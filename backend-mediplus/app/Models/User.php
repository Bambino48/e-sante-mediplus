<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'role',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ===== RELATIONS =====

    /**
     * Profil du médecin
     */
    public function doctorProfile()
    {
        return $this->hasOne(DoctorProfile::class, 'doctor_id');
    }

    /**
     * Disponibilités du médecin
     */
    public function availability()
    {
        return $this->hasMany(Availability::class, 'doctor_id');
    }

    /**
     * Rendez-vous en tant que médecin
     */
    public function appointmentsAsDoctor()
    {
        return $this->hasMany(Appointment::class, 'doctor_id');
    }

    /**
     * Rendez-vous en tant que patient
     */
    public function appointmentsAsPatient()
    {
        return $this->hasMany(Appointment::class, 'patient_id');
    }

    /**
     * Ordonnances émises par le médecin
     */
    public function prescriptionsAsDoctor()
    {
        return $this->hasMany(Prescription::class, 'doctor_id');
    }

    /**
     * Ordonnances reçues par le patient
     */
    public function prescriptionsAsPatient()
    {
        return $this->hasMany(Prescription::class, 'patient_id');
    }

    /**
     * Analyses de triage
     */
    public function triages()
    {
        return $this->hasMany(Triage::class);
    }

    /**
     * Paiements
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Téléconsultations
     */
    public function teleconsults()
    {
        return $this->hasMany(Teleconsult::class);
    }

    /**
     * Notifications
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    // ===== SCOPES =====

    /**
     * Filtre les médecins
     */
    public function scopeDoctor($query)
    {
        return $query->where('role', 'doctor');
    }

    /**
     * Filtre les patients
     */
    public function scopePatient($query)
    {
        return $query->where('role', 'patient');
    }

    /**
     * Filtre les administrateurs
     */
    public function scopeAdmin($query)
    {
        return $query->where('role', 'admin');
    }

    /**
     * Filtre les utilisateurs actifs
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Filtre les utilisateurs inactifs
     */
    public function scopeInactive($query)
    {
        return $query->where('status', 'inactive');
    }

    /**
     * Filtre les utilisateurs suspendus
     */
    public function scopeSuspended($query)
    {
        return $query->where('status', 'suspended');
    }

    // ===== MÉTHODES PERSONNALISÉES =====

    /**
     * Vérifie si l'utilisateur est un médecin
     */
    public function isDoctor()
    {
        return $this->role === 'doctor';
    }

    /**
     * Vérifie si l'utilisateur est un patient
     */
    public function isPatient()
    {
        return $this->role === 'patient';
    }

    /**
     * Vérifie si l'utilisateur est un administrateur
     */
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    /**
     * Vérifie si l'utilisateur est actif
     */
    public function isActive()
    {
        return $this->status === 'active';
    }

    /**
     * Vérifie si l'utilisateur est suspendu
     */
    public function isSuspended()
    {
        return $this->status === 'suspended';
    }

    /**
     * Récupère le profil complet de l'utilisateur
     */
    public function getFullProfile()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->role,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'doctor_profile' => $this->isDoctor() ? $this->doctorProfile : null,
        ];
    }

    /**
     * Suspend l'utilisateur
     */
    public function suspend($reason = null)
    {
        $this->update(['status' => 'suspended']);
        return true;
    }

    /**
     * Réactive l'utilisateur
     */
    public function activate()
    {
        $this->update(['status' => 'active']);
        return true;
    }

    /**
     * Désactive l'utilisateur
     */
    public function deactivate()
    {
        $this->update(['status' => 'inactive']);
        return true;
    }
}
