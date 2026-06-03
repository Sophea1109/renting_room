<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reported_by')->constrained('users')->cascadeOnDelete(); // Owner or Admin ID
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete(); // The bad guest user ID
            $table->string('reason'); // e.g., "Property Damage", "Rule Violation"
            $table->text('details')->nullable();
            $table->string('status')->default('pending'); // pending, reviewed
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_reports');
    }
};