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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            
            // 💡 FIX: Add nullable() so multi-step creations don't throw harsh 1364 general errors
            $table->foreignId('booking_id')
                  ->nullable() 
                  ->constrained('bookings')
                  ->cascadeOnDelete();
            
            // 2. Track how the user is paying ('visa', 'cash', 'khqr')
            $table->string('payment_method')->nullable(); 
            
            // 3. Track the financial states
            $table->enum('payment_status', ['pending', 'completed', 'failed', 'unpaid'])->default('pending');
            
            // 4. Reference token returned by external processing banks
            $table->string('transaction_ref')->nullable(); 
            
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