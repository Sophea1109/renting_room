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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('amount', 10, 2);
            $table->dateTime('paid_at');
            // pending_verification for pay later when tenant upload the slip but owner check later and confirm it
            $table->enum('payment_status', ['unpaid', 'pending_verification', 'paid', 'refunded'])->default('unpaid');
            $table->enum('payment_method', ['credit_card', 'cash'])->default('credit_card');
            $table->string('slip_image')->nullable(); // for pay later, store slip image path
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
