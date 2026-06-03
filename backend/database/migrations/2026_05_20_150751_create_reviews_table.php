<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            
            // We use nullable relationships so a review can belong to either a property or a specific unit
            $table->foreignId('property_id')->nullable()->constrained('properties')->cascadeOnDelete();
            $table->foreignId('unit_id')->nullable()->constrained('units')->cascadeOnDelete();
            
            $table->integer('rating'); // e.g., 1 to 5 stars
            $table->text('comment')->nullable(); // The user's feedback text
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};