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
        Schema::create('offers', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->tinyInteger('level')->comment('1, 2, 3'); // مستوى العرض (1، 2، 3)
            $table->text('discription'); // وصف العرض
            $table->integer('count_month'); // عدد الأشهر
            $table->decimal('price', 10, 2); // السعر (مع تحديد 10 أرقام كحد أقصى و2 منازل عشرية)
            $table->timestamps(); //
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offers');
    }
};
