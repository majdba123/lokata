<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use App\Models\Sub_Category;



class SubcategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        foreach (range(1, 20) as $index) {
            $subcategory = Sub_Category::create([
                'title' => $faker->name,
                'image' => "https://picsum.photos/seed/picsum/300/300",
                'category_id' => rand(1, 20),
            ]);
        }
    }
}
