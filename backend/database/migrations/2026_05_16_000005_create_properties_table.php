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
            $table->decimal('price', 10,2);
            $table->enum('price_type', ['month','year','day']);
            $table->boolean('has_units')->default(true);
            $table->string('tittle');
            $table->string('descrepton')->nullable();
            $table->string('bedrooma');
            $table->boolean('has_kitchen');
            $table->decimal('size_house', 10,2);
            $table->string('bathroom');
            $table->unsignedBigInteger('boking')->nullable();
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
