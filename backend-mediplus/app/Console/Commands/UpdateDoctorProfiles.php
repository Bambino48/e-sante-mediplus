<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\DoctorProfile;
use Illuminate\Console\Command;

class UpdateDoctorProfiles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update:doctor-profiles';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update doctor profiles with detailed information';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $profiles = [
            [
                'name' => 'Dr. Marie Kouassi',
                'email' => 'marie.kouassi@mediplus.com',
                'city' => 'Abidjan',
                'phone' => '+225 01 02 03 04',
                'address' => 'Cocody Angré, 8ᵉ tranche',
                'fees' => 20000,
                'primary_specialty' => 'Cardiologie',
                'bio' => 'Spécialisée en cardiologie depuis plus de 12 ans, j\'accompagne les patients pour les maladies du cœur, l\'hypertension et le suivi cardiovasculaire.',
                'additional_specialties' => ['Cardiologie', 'Médecine générale']
            ],
            [
                'name' => 'Dr. Jean-Marc Koffi',
                'email' => 'jean.koffi@mediplus.com',
                'city' => 'Abidjan',
                'phone' => '+225 01 44 55 66',
                'address' => 'Yopougon Toit Rouge',
                'fees' => 10000,
                'primary_specialty' => 'Médecine générale',
                'bio' => 'Médecin généraliste avec 10 ans d\'expérience, je prends en charge les consultations courantes, le suivi des maladies chroniques et la prévention.',
                'additional_specialties' => ['Médecine générale']
            ],
            [
                'name' => 'Dr. Aïcha Diabaté',
                'email' => 'aicha.diabate@mediplus.com',
                'city' => 'Abidjan',
                'phone' => '+225 07 44 55 11',
                'address' => 'Marcory Zone 4',
                'fees' => 15000,
                'primary_specialty' => 'Pédiatrie',
                'bio' => 'Pédiatre expérimentée, j\'assure le suivi médical des nourrissons, enfants et adolescents, vaccins et maladies infantiles.',
                'additional_specialties' => ['Pédiatrie', 'Médecine générale']
            ],
            [
                'name' => 'Dr. Moussa Traoré',
                'email' => 'moussa.traore@mediplus.com',
                'city' => 'Abidjan',
                'phone' => '+225 05 06 06 07',
                'address' => 'Plateau Dokui',
                'fees' => 18000,
                'primary_specialty' => 'Dermatologie',
                'bio' => 'Dermatologue spécialisé dans les maladies de la peau, allergies, acné et infections dermatologiques.',
                'additional_specialties' => ['Dermatologie']
            ],
            [
                'name' => 'Dr. Clarisse Zadi',
                'email' => 'clarisse.zadi@mediplus.com',
                'city' => 'Bingerville',
                'phone' => '+225 07 08 09 10',
                'address' => 'Quartier Résidentiel, Bingerville',
                'fees' => 25000,
                'primary_specialty' => 'Gynécologie',
                'bio' => 'Gynécologue-obstétricienne, spécialisée dans le suivi de grossesse, fertilité, santé reproductive et échographies.',
                'additional_specialties' => ['Gynécologie', 'Radiologie (écho obstétricale)']
            ],
            [
                'name' => 'Dr. Hervé N\'Dri',
                'email' => 'herve.ndri@mediplus.com',
                'city' => 'Treichville',
                'phone' => '+225 07 88 99 00',
                'address' => 'Avenue 21, Treichville',
                'fees' => 12000,
                'primary_specialty' => 'ORL',
                'bio' => 'Spécialiste des maladies de l\'oreille, du nez et de la gorge, allergies respiratoires et troubles ORL.',
                'additional_specialties' => ['Médecine générale']
            ],
            [
                'name' => 'Dr. Justine Kouadio',
                'email' => 'justine.kouadio@mediplus.com',
                'city' => 'Cocody',
                'phone' => '+225 05 55 44 33',
                'address' => 'Riviera 2, proche du carrefour',
                'fees' => 22000,
                'primary_specialty' => 'Ophtalmologie',
                'bio' => 'Ophtalmologue spécialisée dans les troubles de la vision, glaucome, cataracte et examens visuels complets.',
                'additional_specialties' => ['Ophtalmologie']
            ],
            [
                'name' => 'Dr. Ibrahim Ouattara',
                'email' => 'ibrahim.ouattara@mediplus.com',
                'city' => 'Abobo',
                'phone' => '+225 07 44 55 66',
                'address' => 'Abobo Baoulé',
                'fees' => 30000,
                'primary_specialty' => 'Neurologie',
                'bio' => 'Neurologue spécialisé dans les AVC, migraines, neuropathies et troubles du système nerveux.',
                'additional_specialties' => ['Neurologie']
            ],
            [
                'name' => 'Dr. Mireille Lago',
                'email' => 'mireille.lago@mediplus.com',
                'city' => 'Plateau',
                'phone' => '+225 01 77 88 99',
                'address' => 'Rue du Commerce, Abidjan Plateau',
                'fees' => 17000,
                'primary_specialty' => 'Psychiatrie',
                'bio' => 'Psychologue clinicienne spécialisée dans le stress, anxiété, dépression, thérapies individuelles.',
                'additional_specialties' => ['Psychiatrie']
            ],
            [
                'name' => 'Dr. Adam Koné',
                'email' => 'adam.kone@mediplus.com',
                'city' => 'Koumassi',
                'phone' => '+225 01 01 22 33',
                'address' => 'Koumassi Campement',
                'fees' => 28000,
                'primary_specialty' => 'Urologie',
                'bio' => 'Urologue expérimenté spécialiste des reins, vessie et infections urinaires.',
                'additional_specialties' => ['Urologie']
            ],
            [
                'name' => 'Dr. Clarisse Kouamé',
                'email' => 'clarisse.kouame@mediplus.com',
                'city' => 'Cocody',
                'phone' => '+225 01 55 99 22',
                'address' => 'Riviera Palmeraie',
                'fees' => 25000,
                'primary_specialty' => 'Cardiologie',
                'bio' => 'Cardiologue avec expertise en insuffisance cardiaque, hypertension et réadaptation cardiaque.',
                'additional_specialties' => ['Cardiologie']
            ],
            [
                'name' => 'Infirmière Estelle Yéo',
                'email' => 'estelle.yeo@mediplus.com',
                'city' => 'Cocody',
                'phone' => '+225 07 11 22 33',
                'address' => 'Cocody 7e tranche',
                'fees' => 8000,
                'primary_specialty' => 'Médecine générale',
                'bio' => 'Infirmière diplômée d\'État, spécialisée dans les soins à domicile, pansements, injections et suivi des patients chroniques.',
                'additional_specialties' => ['Médecine générale']
            ],
            [
                'name' => 'Infirmier Alain Kassi',
                'email' => 'alain.kassi@mediplus.com',
                'city' => 'Yopougon',
                'phone' => '+225 05 22 44 88',
                'address' => 'Yopougon Sideci',
                'fees' => 7500,
                'primary_specialty' => 'Médecine générale',
                'bio' => 'Infirmier expérimenté spécialisé dans les soins courants, perfusions, sutures et soins d\'urgence.',
                'additional_specialties' => ['Médecine générale']
            ]
        ];

        $this->info('Updating doctor profiles...');

        foreach ($profiles as $profileData) {
            $user = User::where('email', $profileData['email'])->first();

            if ($user) {
                $profile = DoctorProfile::firstOrCreate(['user_id' => $user->id]);

                $profile->update([
                    'city' => $profileData['city'],
                    'address' => $profileData['address'],
                    'phone' => $profileData['phone'],
                    'fees' => $profileData['fees'],
                    'primary_specialty' => $profileData['primary_specialty'],
                    'bio' => $profileData['bio'],
                ]);

                // Ajouter les spécialités supplémentaires à la bio si elles existent
                if (!empty($profileData['additional_specialties'])) {
                    $additional = "\n\nSpécialités supplémentaires :\n" . implode("\n", $profileData['additional_specialties']);
                    $profile->update(['bio' => $profile->bio . $additional]);
                }

                $this->line("Updated profile for: {$profileData['name']}");
            } else {
                $this->warn("User not found: {$profileData['email']}");
            }
        }

        $this->info('All doctor profiles updated successfully!');
    }
}
