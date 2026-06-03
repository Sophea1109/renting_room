<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use function Laravel\Prompts\table;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->string('tittle');
            $table->string('descrepton')->nullable();
            $table->string('image')->nullable();
            $table->string('floor')->nullable();
            $table->enum('status' , ['available', 'unavailable']);
            $table->foreignId('property_id')->constrained('properties')->cascadeOnDelete();
            $table->enum('price_type', ['month', 'year', 'day']);
            $table->string('residential_water')->nullable();
            $table->string('electricity_prices')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('bed')->nullable();
            $table->string('max_member')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
