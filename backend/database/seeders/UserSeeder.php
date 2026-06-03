<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Super Admin
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'password' => Hash::make('123'),
                'role' => 'admin',
            ]
        );

        // 2. Create a Property Owner (The person who gets paid)
        User::firstOrCreate(
            ['email' => 'owner@example.com'],
            [
                'first_name' => 'John',
                'last_name' => 'Owner',
                'password' => Hash::make('123'),
                'role' => 'owner',
                'payment_gateway_merchant_id' => 'MERCHANT-ABA-KH-778899', // or whatever your system uses for property managers
            ]
        );

        // 3. Create a Customer Guest (The person making the booking)
        User::firstOrCreate(
            ['email' => 'customer@example.com'],
            [
                'first_name' => 'Sok',
                'last_name' => 'Sabaay',
                'password' => Hash::make('123'),
                'role' => 'user',
            ]
        );
    }
}