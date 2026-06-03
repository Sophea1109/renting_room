<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Property;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Property::create([
            'name' => 'Sky View Residence',
            'location' => 'Phnom Penh',
            'user_id' => 1,
            'property_type_id' => 1,
            'image' => 'properties/skyview.jpg',
            'star_rating' => 4.5,
            'floor' => 12,
            'have_gym' => true,
            'have_swing' => false,
            'have_park' => true,
            'payment_policy' => 'pay_first',
        ]);

        Property::create([
            'name' => 'Green Palace Condo',
            'location' => 'Siem Reap',
            'user_id' => 1,
            'property_type_id' => 1,
            'image' => 'properties/greenpalace.jpg',
            'star_rating' => 4.0,
            'floor' => 8,
            'have_gym' => true,
            'have_swing' => true,
            'have_park' => true,
            'payment_policy' => 'pay_later',
        ]);
    }
}