<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('room_number')->nullable();
            $table->string('name');
            $table->string('type')->default('Single');
            $table->decimal('monthly_rent', 10, 2)->default(0);
            $table->integer('beds')->default(1);
            $table->integer('baths')->default(1);
            $table->string('size')->nullable();
            $table->text('description')->nullable();
            $table->string('location')->nullable();
            $table->string('contact_email')->nullable();
            $table->json('amenities')->nullable();
            $table->json('images')->nullable();
            $table->enum('occupancy_status', ['available', 'occupied', 'maintenance', 'reserved', 'cleaning'])->default('available');
            $table->enum('payment_status', ['paid', 'unpaid'])->default('unpaid');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
