<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pharmacy;

class PharmacySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Pharmacy::create([
            'name' => 'Pharmacie Centrale',
            'address' => '123 Rue de la Santé, Abidjan',
            'phone' => '+225 01 02 03 04 05',
            'email' => 'contact@pharmaciecentrale.ci',
            'latitude' => 5.3167,
            'longitude' => -4.0333,
            'is_active' => true,
        ]);

        Pharmacy::create([
            'name' => 'Pharmacie du Bien-être',
            'address' => '456 Avenue des Médicaments, Abidjan',
            'phone' => '+225 01 02 03 04 06',
            'email' => 'info@pharmaciebienetre.ci',
            'latitude' => 5.3200,
            'longitude' => -4.0300,
            'is_active' => true,
        ]);

        Pharmacy::create([
            'name' => 'Pharmacie Moderne',
            'address' => '789 Boulevard de la Pharmacie, Abidjan',
            'phone' => '+225 01 02 03 04 07',
            'email' => 'service@pharmaciemoderne.ci',
            'latitude' => 5.3100,
            'longitude' => -4.0400,
            'is_active' => true,
        ]);
    }
}
