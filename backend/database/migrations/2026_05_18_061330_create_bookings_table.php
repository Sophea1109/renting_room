<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            
            // 1. Core Relationship Connections
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('unit_id')->constrained('units')->cascadeOnDelete();
            $table->foreignId('property_id')->constrained('properties')->cascadeOnDelete();
            
            // 2. Updated Lifecycle Statuses
            // 'pending' = Awaiting Visa Verification (Pay First)
            // 'confirmed' = Active reservation (Instant for Pay Later or Successful Pay First)
            // 'cancelled' = Room released back to public inventory
            // 'completed' = Guest checked out successfully
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
            
            // 3. Operational Stay Details
            $table->date('check_in');
            $table->date('check_out');
            $table->integer('total'); // Calculated dynamically ($days * unit price)
            
            $table->timestamps();
            
            // ❌ REMOVED: payment_id column. 
            // The payments table will link back to this table using booking_id instead!
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};