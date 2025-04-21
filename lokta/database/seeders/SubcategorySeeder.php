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
        $categories = [
            ['title' => 'ملابس نسائية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'ملابس رجالية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'ملابس أطفال', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'إكسسوارات', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'أحذية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'ملابس رياضية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],

            ['title' => 'الهواتف الذكية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'أجهزة الكمبيوتر المحمولة', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'الأجهزة اللوحية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'ملحقات الكمبيوتر', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'كاميرات وأجهزة تصوير', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'سماعات وساعات ذكية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],

            ['title' => 'أدوات المطبخ', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'الأثاث', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'ديكورات المنزل', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'مستلزمات التنظيف', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'الأجهزة المنزلية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'إضاءة', 'image' => 'https://picsum.photos/seed/picsum/300/300'],

            ['title' => 'مستحضرات التجميل', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'العناية بالبشرة', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'العناية بالشعر', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'العطور', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'أدوات الحلاقة', 'image' => 'https://picsum.photos/seed/picsum/300/300'],

            ['title' => 'ألعاب الأطفال', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'الألعاب الإلكترونية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'الأدوات الرياضية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'الطائرات والمركبات الجوية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'الأدوات الموسيقية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],

            ['title' => 'مكملات غذائية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'معدات اللياقة البدنية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'الأجهزة الطبية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'العناية بالصحة', 'image' => 'https://picsum.photos/seed/picsum/300/300'],

            ['title' => 'أثاث غرفة المعيشة', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'أثاث المكتب', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'أسرّة وغرف النوم', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'ستائر وسجاد', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'لوحات وأعمال فنية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],

            ['title' => 'كتب ورقية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'كتب إلكترونية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'أدوات مكتبية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'أدوات تعليمية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],

            ['title' => 'المواد الغذائية الطازجة', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'المعلبات', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'المنتجات الصحية والعضوية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'المشروبات', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'مستلزمات الطبخ', 'image' => 'https://picsum.photos/seed/picsum/300/300'],

            ['title' => 'أدوات الحدائق', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'أثاث الحدائق', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'نباتات وزهور', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'معدات رياضية خارجية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],

            ['title' => 'طعام الحيوانات الأليفة', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'مستلزمات الحيوانات الأليفة', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'ألعاب الحيوانات الأليفة', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'ملابس الحيوانات الأليفة', 'image' => 'https://picsum.photos/seed/picsum/300/300'],

            ['title' => 'حقائب السفر', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'مستلزمات السفر', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'تذاكر الطيران وحجوزات الفنادق', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'أدوات التنقل (دراجات، سكوترات)', 'image' => 'https://picsum.photos/seed/picsum/300/300'],

            ['title' => 'أجهزة ذكية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'روبوتات', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'ملحقات الذكاء الاصطناعي', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'أدوات البرمجة والذكاء الاصطناعي', 'image' => 'https://picsum.photos/seed/picsum/300/300'],

            ['title' => 'دراجات هوائية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'معدات الغطس', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'معدات التخييم', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'رياضات مائية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],

            ['title' => 'كراسي مكاتب', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'طاولات مكاتب', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'رفوف ومكتبات', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'أجهزة كمبيوتر مكتبية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],

            ['title' => 'مجوهرات نسائية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'مجوهرات رجالية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'ساعات يد', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'إكسسوارات فاخرة', 'image' => 'https://picsum.photos/seed/picsum/300/300'],

            ['title' => 'الأعمال الفنية اليدوية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'الحرف اليدوية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'الحلي والمجوهرات اليدوية', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'منتجات مخصصة', 'image' => 'https://picsum.photos/seed/picsum/300/300'],

            ['title' => 'هدايا مخصصة', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'منتجات من وحي التصميم الشخصي', 'image' => 'https://picsum.photos/seed/picsum/300/300'],
            ['title' => 'لوحات وشعارات مخصصة', 'image' => 'https://picsum.photos/seed/picsum/300/300'],

            ['title' => 'Tyre', 'image' => 'https://picsum.photos/seed/picsum/300/300']
        ];

        foreach ($categories as $category) {
            Sub_Category::create($category);
        }
    }
}
