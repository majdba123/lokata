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
        Schema::table('paymentways', function (Blueprint $table) {
                    $table->integer('status')
                  ->default(1); // القيمة الافتراضية 1 (مفعل)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('paymentways', function (Blueprint $table) {
            //
        });
    }
};
