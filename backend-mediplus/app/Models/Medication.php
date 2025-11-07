<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medication extends Model
{
    use HasFactory;

    protected $fillable = [
        'prescription_id',
        'name',
        'dosage',
        'frequency',
        'times',
        'duration_days',
        'start_date',
    ];

    protected $casts = [
        'times' => 'array', // Cast JSON en array PHP
        'start_date' => 'date',
        'frequency' => 'integer',
        'duration_days' => 'integer',
    ];

    /**
     * Relation : Un médicament appartient à une prescription
     */
    public function prescription()
    {
        return $this->belongsTo(Prescription::class);
    }

    /**
     * Calculer la date de fin du traitement
     */
    public function getEndDateAttribute()
    {
        return $this->start_date->addDays($this->duration_days);
    }

    /**
     * Vérifier si le médicament est actif aujourd'hui
     */
    public function isActiveToday()
    {
        $today = now()->toDateString();
        $endDate = $this->start_date->copy()->addDays($this->duration_days)->toDateString();

        return $today >= $this->start_date->toDateString() && $today <= $endDate;
    }
}
