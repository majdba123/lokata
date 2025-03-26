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
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedBigInteger('owner_id')->nullable()->after('brand_id'); // Add owner_id column
            $table->foreign('owner_id')->references('id')->on('users')->onDelete('set null'); // Add foreign key constraint
            $table->dropForeign(['vendor_id']); // Drop foreign key constraint
            $table->dropColumn('vendor_id'); 
        
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['owner_id']);
            $table->dropColumn('owner_id');
            $table->unsignedBigInteger('vendor_id')->nullable()->after('description'); // Add vendor_id column
            $table->foreign('vendor_id')->references('id')->on('vendors')->onDelete('set null'); // Add foreign key constraint
        });
    }
};
