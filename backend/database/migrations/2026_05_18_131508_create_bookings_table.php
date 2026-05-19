<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */

    //not yet migrate, double checking first
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id()->autoIncrement();
            // for room number or booking reference for user to see
            $table->uuid('booking_ref')->unique();
            $table->foreignId('unit_id')->constrained('units')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->date('start_date')->nullable(); // add null
            $table->date('end_date')->nullable(); // add null
            $table->decimal('total_price', 10, 2);
            // booking is free again (after tenant not live there anymore)
            $table->enum('status', ['pending', 'approved', 'rejected', 'completed', 'cancelled'])->default('pending');
            $table->enum('payment_type', ['pay_now', 'pay_later'])->default('pay now');
            $table->string('contract_paylater')->nullable();
            $table->timestamps();
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
