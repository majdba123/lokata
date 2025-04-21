<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([UserSeeder::class]);
        $this->call([VendorSeeder::class]);
        $this->call([BrandSeeder::class]);
        $this->call([SubcategorySeeder::class]);
        $this->call([ProductSeeder::class]);


    }
}
