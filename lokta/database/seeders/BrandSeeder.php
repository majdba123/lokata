<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use App\Models\Brand;
use App\Models\Sub_Category; // تأكد من أن المسار صحيح لنموذج SubCategory

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // الحصول على جميع تصنيفات subcategories المتاحة
        $subCategories = Sub_Category::pluck('id')->toArray();

        // إذا لم توجد subcategories، يمكنك إنشاء بعضها هنا أو إرجاع خطأ
        if (empty($subCategories)) {
            throw new \Exception('لا توجد تصنيفات فرعية متاحة. يرجى تشغيل SubCategorySeeder أولاً.');
        }

        foreach (range(1, 10) as $index) {
            Brand::create([
                'name' => $faker->unique()->word,
                'sub__category_id' => $faker->randomElement($subCategories),
            ]);
        }
    }
}
