<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAppointmentRequest extends FormRequest
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
            'scheduled_at' => 'sometimes|date|after:now',
            'status' => 'sometimes|in:pending,confirmed,cancelled,completed,no_show',
            'reason' => 'sometimes|string|max:500',
            'mode' => 'sometimes|in:presentiel,teleconsult,professionnel',
            'duration' => 'sometimes|integer|min:15|max:180',
            'notes' => 'nullable|string|max:1000',
            'cancellation_reason' => 'sometimes|required_if:status,cancelled|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'scheduled_at.after' => 'La date doit être dans le futur.',
            'status.in' => 'Le statut doit être une valeur valide.',
            'mode.in' => 'Le mode de consultation doit être présentiel, téléconsultation ou professionnel.',
            'duration.integer' => 'La durée doit être un nombre entier.',
            'duration.min' => 'La durée minimale est de 15 minutes.',
            'duration.max' => 'La durée maximale est de 3 heures.',
            'cancellation_reason.required_if' => 'Le motif d\'annulation est obligatoire lors de l\'annulation.',
        ];
    }
}
