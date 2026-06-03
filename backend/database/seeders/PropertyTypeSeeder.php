<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PropertyTypeSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('property_types')->insert([
            [
                'name' => 'Apartment',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Condo',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}