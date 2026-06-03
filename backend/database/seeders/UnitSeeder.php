<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Unit;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Unit::create([
            'tittle' => 'Room A101',
            'descrepton' => 'Nice apartment with city view',
            'image' => null,
            'floor' => '1',
            'status' => 'available',
            'property_id' => 1,
            'price_type' => 'month',
            'residential_water' => '0.50$/m3',
            'electricity_prices' => '0.25$/kWh',
            'price' => 350.00,
            'bed' => '2',
            'max_member' => '4',
        ]);

        Unit::create([
            'tittle' => 'Room B202',
            'descrepton' => 'Luxury condo with balcony',
            'image' => 'units/FBymqi4H4vyKdYegi3P0GC5CsNWeu5WibR9lFIum.jpg',
            'floor' => '2',
            'status' => 'unavailable',
            'property_id' => 1,
            'price_type' => 'year',
            'residential_water' => '0.75$/m3',
            'electricity_prices' => '0.30$/kWh',
            'price' => 4200.00,
            'bed' => '3',
            'max_member' => '5',
        ]);
    }
}