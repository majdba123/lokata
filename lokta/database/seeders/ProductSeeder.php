<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        $faker = Faker::create();
        foreach (range(1, 20) as $index) {
            Product::create([
                'title' => $faker->word,
                'description' => $faker->sentence,
                'price' => $faker->randomFloat(2, 10, 1000),
                'images' => json_encode(["https://picsum.photos/seed/picsum/300/300"]),
                'sub__category_id' => rand(1, 20),
                'owner_id' => rand(1, 10),
                'brand_id' => rand(1, 10),
            ]);
        }
    }
}
