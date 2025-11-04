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
        Schema::create('shortlink_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shortlink_id')->constrained()->onDelete('cascade');
            $table->string('url', 2048);
            $table->unsignedTinyInteger('weight');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shortlink_variants');
    }
};
