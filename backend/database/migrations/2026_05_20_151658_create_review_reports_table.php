<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('review_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete(); // The owner reporting it
            $table->foreignId('review_id')->constrained('reviews')->cascadeOnDelete(); // The bad review
            $table->string('reason'); // e.g., 'Abusive language', 'Fake review'
            $table->text('details')->nullable(); // Extra explanation from the owner
            $table->enum('status', ['pending', 'investigated', 'dismissed'])->default('pending'); // Admin status
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('review_reports');
    }
};