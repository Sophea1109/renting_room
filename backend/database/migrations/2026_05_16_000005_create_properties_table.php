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
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('location');
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('property_type_id')->constrained('property_types')->cascadeOnDelete();
            $table->string('image')->nullable();
            $table->decimal('star_rating', 2,1)->nullable();
            $table->integer('floor')->nullable();
            $table->boolean('have_gym')->default(false);
            $table->boolean('have_swing')->default(false);
            $table->boolean('have_park')->default(false);
            $table->enum('payment_policy', ['pay_first', 'pay_later', 'all']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
