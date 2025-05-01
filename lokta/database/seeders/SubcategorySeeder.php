<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Sub_Category;

class SubcategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subCategories = [
            // Category 1: الملابس والأزياء
            ['title' => 'ملابس نسائية', 'image' => 'https://picsum.photos/seed/picsum/300/300', 'category_id' => 1],
            ['title' => 'ملابس رجالية', 'image' => 'https://picsum.photos/seed/picsum/300/300', 'category_id' => 1],
            ['title' => 'ملابس أطفال', 'image' => 'https://picsum.photos/seed/picsum/300/300', 'category_id' => 1],
            ['title' => 'إكسسوارات', 'image' => 'https://picsum.photos/seed/picsum/300/300', 'category_id' => 1],
            ['title' => 'أحذية', 'image' => 'https://picsum.photos/seed/picsum/300/300', 'category_id' => 1],
            ['title' => 'ملابس رياضية', 'image' => 'https://picsum.photos/seed/picsum/300/300', 'category_id' => 1],
            ['title' => 'مجوهرات نسائية', 'image' => 'https://picsum.photos/seed/picsum/300/300', 'category_id' => 1],
            ['title' => 'مجوهرات رجالية', 'image' => 'https://picsum.photos/seed/picsum/300/300', 'category_id' => 1],
            ['title' => 'ساعات يد', 'image' => 'https://picsum.photos/seed/picsum/300/300', 'category_id' => 1],
            ['title' => 'إكسسوارات فاخرة', 'image' => 'https://picsum.photos/seed/picsum/300/300', 'category_id' => 1],

            // Category 2: الإلكترونيات
            ['title' => 'الهواتف الذكية', 'image' => 'https://picsum.photos/seed/picsum/300/300', 'category_id' => 2],
            ['title' => 'أجهزة الكمبيوتر المحمولة', 'image' => 'https://picsum.photos/seed/picsum/300/300', 'category_id' => 2],
            ['title' => 'الأجهزة اللوحية', 'image' => 'https://picsum.photos/seed/picsum/300/300', 'category_id' => 2],
            ['title' => 'ملحقات الكمبيوتر', 'image' => 'https://picsum.photos/seed/picsum/300/300', 'category_id' => 2],
            ['title' => 'كاميرات وأجهزة تصوير', 'image' => 'https://picsum.photos/seed/picsum/300/300', 'category_id' => 2],
            ['title' => 'سماعات وساعات ذكية', 'image' => 'https://picsum.photos/seed/picsum/300/300', 'category_id' => 2],
            ['title' => 'أجهزة ذكية', 'image' => 'https://picsum.photos/seed/picsum/300/300', 'category_id' => 2],
            ['title' => 'روبوتات', 'image' => 'https://picsum.photos/seed/picsum/300/300', 'category_id' => 2],
            ['title' => 'ملحقات الذكاء الاصطناعي', 'image' => 'https://picsum.photos/seed/picsum/300/300', 'category_id' => 2],
            ['title' => 'أدوات البرمجة والذكاء الاصطناعي', 'image' => 'https://picsum.photos/seed/picsum/300/300', 'category_id' => 2],
            ['title' => 'أجهزة كمبيوتر مكتبية', 'image' => 'https://picsum.photos/seed/picsum/300/300', 'category_id' => 2],

            // يمكنك الاستمرار في توزيع باقي الفئات الفرعية حسب الحاجة
            // مع تعيين category_id المناسب لكل مجموعة
        ];

        foreach ($subCategories as $subCategory) {
            Sub_Category::create($subCategory);
        }
    }
}
