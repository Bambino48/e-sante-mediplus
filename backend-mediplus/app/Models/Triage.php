<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Triage extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'symptoms',
        'duration',
        'severity',
        'analysis',
        'recommendation',
        'ai_model',
        'confidence_score',
    ];

    protected $casts = [
        'symptoms' => 'json',
        'confidence_score' => 'decimal:2',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeHighSeverity($query)
    {
        return $query->where('severity', 'severe');
    }

    public function scopeRecent($query)
    {
        return $query->where('created_at', '>=', now()->subDays(7));
    }
}
