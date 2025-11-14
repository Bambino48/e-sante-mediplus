<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $fillable = [
        'patient_id',
        'doctor_id',
        'scheduled_at',
        'status',
        'reason',
        'notes',
        'mode',
        'duration',
        'reminder_sent',
        'cancellation_reason'
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'reminder_sent' => 'boolean',
        'duration' => 'integer',
    ];

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }
    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    // Scopes pour filtrer les rendez-vous
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    public function scopeByDoctor($query, $doctorId)
    {
        return $query->where('doctor_id', $doctorId);
    }

    public function scopeByPatient($query, $patientId)
    {
        return $query->where('patient_id', $patientId);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('scheduled_at', '>', now());
    }

    public function scopePast($query)
    {
        return $query->where('scheduled_at', '<', now());
    }

    // Méthodes utilitaires
    public function canBeCancelled()
    {
        return in_array($this->status, ['pending', 'confirmed']) &&
            $this->scheduled_at->isFuture();
    }

    public function canBeRescheduled()
    {
        return in_array($this->status, ['pending', 'confirmed']) &&
            $this->scheduled_at->isFuture();
    }

    public function isTeleconsultation()
    {
        return $this->mode === 'teleconsult';
    }

    public function isInPerson()
    {
        return $this->mode === 'presentiel';
    }

    public function markAsCompleted()
    {
        $this->update(['status' => 'completed']);
    }

    public function cancel($reason = null)
    {
        $this->update([
            'status' => 'cancelled',
            'cancellation_reason' => $reason
        ]);
    }
}
