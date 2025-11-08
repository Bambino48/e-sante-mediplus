# 🏥 E-Santé MediPlus - Spécifications Backend Dashboard Patient

## 📋 Vue d'ensemble

Le dashboard patient nécessite plusieurs entités interconnectées pour fonctionner pleinement. Voici la spécification complète des tables, APIs et relations nécessaires.

---

## 🗄️ Tables de Base de Données

### 1. `users` (Utilisateurs)

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'France',
    role ENUM('patient', 'doctor', 'admin') NOT NULL,
    email_verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. `doctors` (Médecins)

```sql
CREATE TABLE doctors (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    specialty VARCHAR(100),
    license_number VARCHAR(50) UNIQUE,
    experience_years INT,
    consultation_fee DECIMAL(10,2),
    bio TEXT,
    education TEXT,
    certifications TEXT,
    languages JSON,
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_specialty (specialty),
    INDEX idx_rating (rating),
    INDEX idx_available (is_available)
);
```

### 3. `appointments` (Rendez-vous)

```sql
CREATE TABLE appointments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    scheduled_at DATETIME NOT NULL,
    duration_minutes INT DEFAULT 30,
    status ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
    mode ENUM('physical', 'video') DEFAULT 'physical',
    reason TEXT,
    notes TEXT,
    meeting_link VARCHAR(500),
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    INDEX idx_patient_scheduled (patient_id, scheduled_at),
    INDEX idx_doctor_scheduled (doctor_id, scheduled_at),
    INDEX idx_status (status)
);
```

### 4. `prescriptions` (Ordonnances)

```sql
CREATE TABLE prescriptions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_id BIGINT NULL,
    status ENUM('draft', 'signed', 'cancelled') DEFAULT 'draft',
    valid_until DATE,
    notes TEXT,
    pdf_url VARCHAR(500),
    qr_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
    INDEX idx_patient_created (patient_id, created_at),
    INDEX idx_status (status)
);
```

### 5. `medications` (Médicaments)

```sql
CREATE TABLE medications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    prescription_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    duration_days INT,
    instructions TEXT,
    times JSON, -- ['08:00', '14:00', '20:00']
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE,
    INDEX idx_active_dates (is_active, start_date, end_date)
);
```

### 6. `notifications` (Notifications)

```sql
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    type ENUM('appointment_reminder', 'prescription_ready', 'results_available', 'medication_reminder', 'general') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSON, -- Données supplémentaires (appointment_id, prescription_id, etc.)
    is_read BOOLEAN DEFAULT false,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    expires_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, is_read),
    INDEX idx_type (type),
    INDEX idx_priority (priority),
    INDEX idx_created (created_at)
);
```

### 7. `medical_records` (Dossier médical)

```sql
CREATE TABLE medical_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_id BIGINT NULL,
    record_type ENUM('consultation', 'exam_results', 'prescription', 'vaccination', 'allergy', 'chronic_condition') NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    attachments JSON, -- URLs des fichiers attachés
    is_confidential BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
    INDEX idx_patient_type (patient_id, record_type),
    INDEX idx_created (created_at)
);
```

---

## 🔌 Endpoints API Requis

### Authentification Requise

Tous les endpoints nécessitent un token JWT valide dans le header `Authorization: Bearer {token}`

### 1. Rendez-vous (`/api/patient/appointments`)

#### GET `/api/patient/appointments/next`

**Récupère le prochain rendez-vous du patient**

```json
{
  "appointment": {
    "id": 123,
    "doctor_id": 456,
    "doctor_name": "Dr. Marie Dubois",
    "scheduled_at": "2024-11-15T14:30:00Z",
    "status": "confirmed",
    "mode": "physical",
    "reason": "Consultation de suivi"
  }
}
```

#### GET `/api/patient/appointments`

**Liste des rendez-vous du patient**

```json
{
  "items": [
    {
      "id": 123,
      "doctor_name": "Dr. Marie Dubois",
      "specialty": "Cardiologie",
      "scheduled_at": "2024-11-15T14:30:00Z",
      "status": "confirmed",
      "mode": "physical"
    }
  ]
}
```

### 2. Médicaments (`/api/medications`)

#### GET `/api/medications/today`

**Médicaments à prendre aujourd'hui**

```json
{
  "items": [
    {
      "id": 789,
      "name": "Paracétamol",
      "dosage": "500mg",
      "times": ["08:00", "14:00", "20:00"],
      "instructions": "Prendre avec un verre d'eau"
    }
  ]
}
```

### 3. Notifications (`/api/notifications`)

#### GET `/api/notifications/unread`

**Notifications non lues**

```json
{
  "count": 3,
  "items": [
    {
      "id": 101,
      "type": "results_available",
      "title": "Résultats d'analyses disponibles",
      "message": "Vos résultats de prise de sang sont prêts",
      "priority": "high",
      "created_at": "2024-11-08T10:00:00Z"
    }
  ]
}
```

### 4. Médecins (`/api/doctors`)

#### GET `/api/doctors`

**Liste des médecins (avec filtres)**

```json
{
  "doctors": [
    {
      "id": 456,
      "name": "Dr. Marie Dubois",
      "specialty": "Cardiologie",
      "rating": 4.8,
      "consultation_fee": 15000,
      "next_availability": "Dès demain",
      "distance_km": 2.5
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 12,
    "total": 150
  }
}
```

### 5. Dossier Médical (`/api/patient/records`)

#### GET `/api/patient/records/recent`

**Consultations récentes**

```json
{
  "items": [
    {
      "id": 202,
      "doctor_name": "Dr. Marie Dubois",
      "specialty": "Cardiologie",
      "record_type": "consultation",
      "title": "Consultation de suivi",
      "created_at": "2024-11-08T14:30:00Z",
      "status": "completed"
    }
  ]
}
```

---

## 🔄 Logique Métier Requise

### 1. Calcul des médicaments du jour

```sql
-- Médicaments actifs dont la date du jour est entre start_date et end_date
SELECT m.* FROM medications m
JOIN prescriptions p ON m.prescription_id = p.id
WHERE p.patient_id = ? AND m.is_active = 1
AND CURDATE() BETWEEN m.start_date AND COALESCE(m.end_date, CURDATE())
ORDER BY m.created_at DESC;
```

### 2. Prochain rendez-vous

```sql
-- Rendez-vous futur le plus proche
SELECT a.*, d.user_id as doctor_user_id, u.first_name, u.last_name
FROM appointments a
JOIN doctors d ON a.doctor_id = d.id
JOIN users u ON d.user_id = u.id
WHERE a.patient_id = ? AND a.status IN ('scheduled', 'confirmed')
AND a.scheduled_at > NOW()
ORDER BY a.scheduled_at ASC
LIMIT 1;
```

### 3. Notifications non lues

```sql
-- Compte et liste des notifications récentes
SELECT COUNT(*) as count FROM notifications
WHERE user_id = ? AND is_read = 0;

SELECT * FROM notifications
WHERE user_id = ? AND is_read = 0
ORDER BY priority DESC, created_at DESC
LIMIT 10;
```

### 4. Médecins recommandés

```sql
-- Top médecins par note avec profil complet
SELECT d.*, u.first_name, u.last_name,
       (6371 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lng) - radians(?)) + sin(radians(?)) * sin(radians(lat)))) AS distance_km
FROM doctors d
JOIN users u ON d.user_id = u.id
WHERE d.is_available = 1
ORDER BY d.rating DESC, distance_km ASC
LIMIT 12;
```

---

## 🚀 Points d'attention pour l'implémentation

### 1. **Authentification & Autorisation**

- Middleware JWT pour tous les endpoints patients
- Vérification que l'utilisateur est bien un patient
- Accès limité aux données personnelles uniquement

### 2. **Performance**

- Indexes sur les colonnes fréquemment requêtées
- Cache Redis pour les données statiques (médecins, spécialités)
- Pagination pour les listes longues

### 3. **Sécurité**

- Validation stricte des données d'entrée
- Sanitisation des données de sortie
- Logs d'audit pour les actions sensibles

### 4. **Temps réel**

- WebSockets pour les notifications push
- Cache invalidation lors des modifications
- Background jobs pour les rappels automatiques

### 5. **Données de test**

- Seeds pour créer des données de démonstration
- Factory pour générer des données réalistes
- Scripts de migration pour la production

---

## 📊 Scripts SQL d'initialisation

```sql
-- Insertion de données de test
INSERT INTO users (email, password, first_name, last_name, role) VALUES
('patient@test.com', '$2y$10$hash', 'Jean', 'Dupont', 'patient'),
('docteur@test.com', '$2y$10$hash', 'Marie', 'Dubois', 'doctor');

INSERT INTO doctors (user_id, specialty, consultation_fee, rating) VALUES
(2, 'Cardiologie', 15000, 4.8);

INSERT INTO appointments (patient_id, doctor_id, scheduled_at, status) VALUES
(1, 1, '2024-11-15 14:30:00', 'confirmed');

INSERT INTO notifications (user_id, type, title, message, priority) VALUES
(1, 'results_available', 'Résultats disponibles', 'Vos analyses sont prêtes', 'high');
```

Cette spécification couvre tous les besoins du dashboard patient pour le rendre pleinement fonctionnel ! 🎯</content>
<parameter name="filePath">c:\Users\Ibamb\Ma Formation personnelle\e-sante-mediplus\frontend-mediplus\BACKEND_SPECIFICATIONS.md
