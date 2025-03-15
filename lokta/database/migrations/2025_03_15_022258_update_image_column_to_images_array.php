<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            // First, rename the column from 'image' to 'images'
            $table->renameColumn('image', 'images');

        });
    }

    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            // Reverse the changes
            $table->renameColumn('images', 'image');
        });
    }
};
