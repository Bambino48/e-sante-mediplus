<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class SeedDoctors extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'seed:doctors';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed the database with doctor users';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $doctors = [
            ["name" => "Dr. Marie Kouassi", "email" => "marie.kouassi@mediplus.com", "password" => "secret123", "role" => "doctor"],
            ["name" => "Dr. Jean-Marc Koffi", "email" => "jean.koffi@mediplus.com", "password" => "secret123", "role" => "doctor"],
            ["name" => "Dr. Emmanuel Yao", "email" => "emmanuel.yao@mediplus.com", "password" => "secret123", "role" => "doctor"],
            ["name" => "Dr. Aïcha Diabaté", "email" => "aicha.diabate@mediplus.com", "password" => "secret123", "role" => "doctor"],
            ["name" => "Dr. Nadia Gondo", "email" => "nadia.gondo@mediplus.com", "password" => "secret123", "role" => "doctor"],
            ["name" => "Dr. Hervé N'Dri", "email" => "herve.ndri@mediplus.com", "password" => "secret123", "role" => "doctor"],
            ["name" => "Dr. Clarisse Kouamé", "email" => "clarisse.kouame@mediplus.com", "password" => "secret123", "role" => "doctor"],
            ["name" => "Dr. Clarisse Zadi", "email" => "clarisse.zadi@mediplus.com", "password" => "secret123", "role" => "doctor"],
            ["name" => "Dr. Sarah Kacou", "email" => "sarah.kacou@mediplus.com", "password" => "secret123", "role" => "doctor"],
            ["name" => "Dr. Ibrahim Ouattara", "email" => "ibrahim.ouattara@mediplus.com", "password" => "secret123", "role" => "doctor"],
            ["name" => "Dr. Mireille Lago", "email" => "mireille.lago@mediplus.com", "password" => "secret123", "role" => "doctor"],
            ["name" => "Dr. Justine Kouadio", "email" => "justine.kouadio@mediplus.com", "password" => "secret123", "role" => "doctor"],
            ["name" => "Dr. Adam Koné", "email" => "adam.kone@mediplus.com", "password" => "secret123", "role" => "doctor"],
            ["name" => "Dr. Moussa Traoré", "email" => "moussa.traore@mediplus.com", "password" => "secret123", "role" => "doctor"],
            ["name" => "Infirmière Estelle Yéo", "email" => "estelle.yeo@mediplus.com", "password" => "secret123", "role" => "doctor"],
            ["name" => "Infirmier Alain Kassi", "email" => "alain.kassi@mediplus.com", "password" => "secret123", "role" => "doctor"]
        ];

        $this->info('Seeding doctors...');

        foreach ($doctors as $doctor) {
            if (!User::where('email', $doctor['email'])->exists()) {
                User::create([
                    'name' => $doctor['name'],
                    'email' => $doctor['email'],
                    'password' => Hash::make($doctor['password']),
                    'role' => $doctor['role'],
                ]);
                $this->line("Created: {$doctor['name']}");
            } else {
                $this->line("Skipped (already exists): {$doctor['name']}");
            }
        }

        $this->info('All doctors seeded successfully!');
    }
}
