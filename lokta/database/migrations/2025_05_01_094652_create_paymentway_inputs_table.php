<?php

use App\Models\Paymentway;
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
        Schema::create('paymentway_inputs', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Paymentway::class)->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('type');
            $table->string('value');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paymentway_inputs');
    }
};
