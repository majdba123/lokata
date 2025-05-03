<?php

use App\Models\Sub_Category;
use App\Models\Vendor;
use App\Models\Brand;
use App\Models\Offer;
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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('image');
            $table->integer('price');
            $table->string('currency');
            $table->string('discreption');
            $table->foreignIdFor(Sub_Category::class)->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignIdFor(Brand::class)->nullable();
            $table->foreignIdFor(Offer::class)->nullable();
            $table->foreignIdFor(Paymentway::class)->nullable();
            $table->json('payment_inputs'); // لتخزين بيانات الدفع
            $table->enum('status', ['pending', 'approved', 'rejected', 'completed','expired'])->default('pending');
            $table->date('start_date')->nullable(); // تاريخ بداية العرض
            $table->date('end_date')->nullable(); // تاريخ نهاية العرض
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
