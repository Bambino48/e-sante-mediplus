<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check(); // L'utilisateur doit être authentifié
    }

    public function rules(): array
    {
        return [
            'doctor_id' => 'required|exists:users,id',
            'scheduled_at' => 'required|date|after:now',
            'reason' => 'required|string|max:500',
            'mode' => 'required|in:presentiel,teleconsult,professionnel',
            'duration' => 'nullable|integer|min:15|max:180', // 15 minutes à 3 heures
            'notes' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'doctor_id.required' => 'Le médecin est obligatoire.',
            'doctor_id.exists' => 'Le médecin sélectionné n\'existe pas.',
            'scheduled_at.required' => 'La date et heure sont obligatoires.',
            'scheduled_at.after' => 'La date doit être dans le futur.',
            'reason.required' => 'Le motif de consultation est obligatoire.',
            'mode.required' => 'Le mode de consultation est obligatoire.',
            'mode.in' => 'Le mode de consultation doit être présentiel, téléconsultation ou professionnel.',
            'duration.integer' => 'La durée doit être un nombre entier.',
            'duration.min' => 'La durée minimale est de 15 minutes.',
            'duration.max' => 'La durée maximale est de 3 heures.',
        ];
    }
}
