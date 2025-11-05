# API Endpoints Documentation

## Base URL

```
Production: https://api.mediplus.com
Development: http://localhost:8000/api
```

## Authentication

### Register User

```http
POST /api/register
Content-Type: application/json

{
  "name": "Dr. John Doe",
  "email": "john.doe@mediplus.com",
  "password": "securePassword123",
  "password_confirmation": "securePassword123",
  "role": "doctor|patient|admin"
}
```

**Response 201:**

```json
{
    "success": true,
    "data": {
        "user": {
            "id": 1,
            "name": "Dr. John Doe",
            "email": "john.doe@mediplus.com",
            "role": "doctor"
        },
        "token": "1|eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9..."
    }
}
```

### Login User

```http
POST /api/login
Content-Type: application/json

{
  "email": "john.doe@mediplus.com",
  "password": "securePassword123"
}
```

**Response 200:**

```json
{
    "success": true,
    "data": {
        "user": {
            "id": 1,
            "name": "Dr. John Doe",
            "email": "john.doe@mediplus.com",
            "role": "doctor"
        },
        "token": "1|eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9..."
    }
}
```

### Logout User

```http
POST /api/logout
Authorization: Bearer {token}
```

**Response 200:**

```json
{
    "success": true,
    "message": "Successfully logged out"
}
```

## Doctor Endpoints

### List All Doctors (Public)

```http
GET /api/doctors
```

**Query Parameters:**

-   `per_page` (integer, default: 20): Number of doctors per page
-   `sort_by` (string, default: name): Sort field (name, created_at, rating, fees)
-   `sort_order` (string, default: asc): Sort order (asc, desc)
-   `city` (string, optional): Filter by city
-   `specialty` (string, optional): Filter by specialty
-   `has_profile` (boolean, default: true): Include only doctors with complete profile

**Response 200:**

```json
{
    "success": true,
    "data": {
        "doctors": [
            {
                "id": 1,
                "name": "Dr. John Doe",
                "email": "john.doe@mediplus.com",
                "phone": "+221 77 123 45 67",
                "photo": "https://example.com/photos/doctor1.jpg",
                "location": {
                    "latitude": 14.6928,
                    "longitude": -17.4467,
                    "city": "Dakar",
                    "address": "Avenue Bourguiba, Plateau"
                },
                "profile": {
                    "bio": "Cardiologue spécialisé en cardiologie interventionnelle.",
                    "fees": 25000,
                    "rating": 4.8,
                    "primary_specialty": "Cardiologie",
                    "phone": "+221 33 123 45 67",
                    "availability": ["Lundi 08:00-12:00", "Mardi 14:00-18:00"]
                },
                "specialties": ["Cardiologie", "Médecine Interne"],
                "member_since": "2023-01-15",
                "has_complete_profile": true
            }
        ],
        "pagination": {
            "total": 45,
            "per_page": 20,
            "current_page": 1,
            "last_page": 3,
            "from": 1,
            "to": 20
        },
        "filters": {
            "city": null,
            "specialty": null,
            "has_profile": true
        },
        "sorting": {
            "sort_by": "name",
            "sort_order": "asc"
        }
    },
    "message": "Liste des médecins récupérée avec succès"
}
```

### Get Doctor Profile

```http
GET /api/doctor/profile
Authorization: Bearer {token}
```

**Response 200:**

```json
{
    "success": true,
    "data": {
        "id": 1,
        "user_id": 1,
        "specialty_id": 1,
        "license_number": "MD12345",
        "years_experience": 5,
        "consultation_fee": 50.0,
        "bio": "Experienced cardiologist...",
        "specialty": {
            "id": 1,
            "name": "Cardiology",
            "description": "Heart and cardiovascular system"
        }
    }
}
```

### Update Doctor Profile

```http
PUT /api/doctor/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "specialty_id": 2,
  "license_number": "MD12345",
  "years_experience": 6,
  "consultation_fee": 55.00,
  "bio": "Updated bio..."
}
```

### Get Doctor Availability

```http
GET /api/pro/availability
Authorization: Bearer {token}
```

**Response 200:**

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "doctor_id": 1,
            "day_of_week": "monday",
            "start_time": "09:00:00",
            "end_time": "17:00:00",
            "is_available": true
        }
    ]
}
```

### Add Availability

```http
POST /api/pro/availability
Authorization: Bearer {token}
Content-Type: application/json

{
  "day_of_week": "tuesday",
  "start_time": "09:00",
  "end_time": "17:00",
  "is_available": true
}
```

## Patient Endpoints

### Get Patient Appointments

```http
GET /api/patient/appointments
Authorization: Bearer {token}
```

**Response 200:**

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "doctor_id": 1,
            "patient_id": 2,
            "appointment_date": "2025-11-15",
            "appointment_time": "10:00:00",
            "status": "confirmed",
            "consultation_type": "teleconsult",
            "doctor": {
                "name": "Dr. John Doe",
                "specialty": "Cardiology"
            }
        }
    ]
}
```

### Book Appointment

```http
POST /api/patient/appointments
Authorization: Bearer {token}
Content-Type: application/json

{
  "doctor_id": 1,
  "appointment_date": "2025-11-20",
  "appointment_time": "14:00",
  "consultation_type": "teleconsult",
  "symptoms": "Chest pain and shortness of breath",
  "notes": "Urgent consultation needed"
}
```

### Search Doctors

```http
GET /api/search?specialty=cardiology&location=dakar&available_today=true
Authorization: Bearer {token}
```

**Response 200:**

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Dr. John Doe",
            "specialty": "Cardiology",
            "consultation_fee": 50.0,
            "rating": 4.8,
            "years_experience": 5,
            "next_available": "2025-11-15 10:00:00"
        }
    ],
    "pagination": {
        "current_page": 1,
        "total_pages": 5,
        "total_results": 23
    }
}
```

## Teleconsultation Endpoints

### Create Teleconsult Room

```http
POST /api/teleconsult/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "appointment_id": 1,
  "room_name": "consultation_123",
  "max_participants": 2
}
```

**Response 201:**

```json
{
    "success": true,
    "data": {
        "room_id": "room_abc123",
        "room_name": "consultation_123",
        "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "join_url": "https://teleconsult.mediplus.com/room/room_abc123",
        "expires_at": "2025-11-15T11:00:00Z"
    }
}
```

### Get Room Access Token

```http
GET /api/teleconsult/token/{roomId}
Authorization: Bearer {token}
```

**Response 200:**

```json
{
    "success": true,
    "data": {
        "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "expires_at": "2025-11-15T11:00:00Z",
        "participant_role": "doctor|patient"
    }
}
```

## AI Triage Endpoints

### Analyze Symptoms

```http
POST /api/triage
Authorization: Bearer {token}
Content-Type: application/json

{
  "symptoms": [
    "chest pain",
    "shortness of breath",
    "dizziness"
  ],
  "duration": "2 hours",
  "severity": "moderate",
  "patient_age": 45,
  "patient_gender": "male",
  "medical_history": ["hypertension"]
}
```

**Response 200:**

```json
{
    "success": true,
    "data": {
        "triage_id": "triage_001",
        "urgency_level": "high",
        "recommended_action": "immediate_consultation",
        "suggested_specialty": "cardiology",
        "confidence_score": 0.92,
        "recommendations": [
            "Seek immediate medical attention",
            "Consider emergency room visit",
            "Monitor vital signs"
        ],
        "estimated_wait_time": "30 minutes"
    }
}
```

### Get Triage History

```http
GET /api/triage/history?limit=10&page=1
Authorization: Bearer {token}
```

**Response 200:**

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "triage_id": "triage_001",
            "created_at": "2025-11-15T08:30:00Z",
            "urgency_level": "high",
            "symptoms": ["chest pain", "shortness of breath"],
            "recommended_action": "immediate_consultation",
            "status": "completed"
        }
    ]
}
```

## Payment Endpoints

### Create Payment

```http
POST /api/payment/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "appointment_id": 1,
  "amount": 50.00,
  "currency": "XOF",
  "payment_method": "orange_money",
  "phone_number": "+221701234567"
}
```

**Response 201:**

```json
{
    "success": true,
    "data": {
        "payment_id": "pay_123abc",
        "amount": 50.0,
        "currency": "XOF",
        "status": "pending",
        "payment_url": "https://payment.orangemoney.com/pay/123abc",
        "expires_at": "2025-11-15T09:30:00Z"
    }
}
```

### Verify Payment

```http
POST /api/payment/verify
Authorization: Bearer {token}
Content-Type: application/json

{
  "payment_id": "pay_123abc",
  "transaction_id": "txn_456def"
}
```

**Response 200:**

```json
{
    "success": true,
    "data": {
        "payment_id": "pay_123abc",
        "status": "completed",
        "verified_at": "2025-11-15T08:45:00Z",
        "receipt_url": "https://api.mediplus.com/receipts/pay_123abc.pdf"
    }
}
```

## Notification Endpoints

### Get Notifications

```http
GET /api/notifications?unread_only=true&limit=20
Authorization: Bearer {token}
```

**Response 200:**

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "title": "Appointment Confirmed",
            "message": "Your appointment with Dr. John Doe has been confirmed for Nov 15, 2025 at 10:00 AM",
            "type": "appointment",
            "priority": "normal",
            "read_at": null,
            "created_at": "2025-11-14T20:00:00Z"
        }
    ],
    "unread_count": 5
}
```

## Configuration Endpoints

### Get App Settings

```http
GET /api/config/settings
Authorization: Bearer {token}
```

**Response 200:**

```json
{
    "success": true,
    "data": {
        "app_name": "Mediplus",
        "app_version": "1.0.0",
        "supported_languages": ["fr", "en", "wo"],
        "default_currency": "XOF",
        "consultation_fee_range": {
            "min": 10.0,
            "max": 200.0
        },
        "teleconsult_duration_limit": 60
    }
}
```

### Get Available Languages

```http
GET /api/config/languages
```

**Response 200:**

```json
{
    "success": true,
    "data": [
        {
            "code": "fr",
            "name": "Français",
            "flag": "🇫🇷"
        },
        {
            "code": "en",
            "name": "English",
            "flag": "🇺🇸"
        },
        {
            "code": "wo",
            "name": "Wolof",
            "flag": "🇸🇳"
        }
    ]
}
```

## Status Codes

| Code | Status                | Description                   |
| ---- | --------------------- | ----------------------------- |
| 200  | OK                    | Request successful            |
| 201  | Created               | Resource created successfully |
| 400  | Bad Request           | Invalid request data          |
| 401  | Unauthorized          | Authentication required       |
| 403  | Forbidden             | Access denied                 |
| 404  | Not Found             | Resource not found            |
| 422  | Unprocessable Entity  | Validation errors             |
| 429  | Too Many Requests     | Rate limit exceeded           |
| 500  | Internal Server Error | Server error                  |

## Authentication Headers

All protected endpoints require:

```
Authorization: Bearer {your_access_token}
Content-Type: application/json
Accept: application/json
```

## 📈 Rate Limiting

-   **General API**: 1000 requests per hour
-   **Authentication**: 5 attempts per minute
-   **Payment**: 10 requests per minute
-   **Triage AI**: 50 requests per hour

## Internationalization

Add language header for localized responses:

```
Accept-Language: fr|en|wo
```
