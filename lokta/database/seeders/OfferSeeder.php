<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Offer;

class OfferSeeder extends Seeder
{
    public function run()
    {
        // مسح البيانات القديمة إذا وجدت
        Offer::truncate();

        // العروض الأساسية
        $offers = [
            [
                'title' => 'العرض الأساسي',
                'level' => 1,
                'discription' => 'عرض مناسب للمبتدئين مع مميزات أساسية',
                'count_month' => 1,
                'price' => 10.99,
            ],
            [
                'title' => 'العرض المتوسط',
                'level' => 2,
                'discription' => 'عرض متوسط مع مميزات إضافية',
                'count_month' => 3,
                'price' => 29.99,
            ],
            [
                'title' => 'العرض المميز',
                'level' => 3,
                'discription' => 'عرض شامل بكل المميزات',
                'count_month' => 12,
                'price' => 99.99,
            ],
            [
                'title' => 'عرض تجريبي',
                'level' => 1,
                'discription' => 'عرض تجريبي لمدة أسبوع',
                'count_month' => 0, // 0 يعني عرض تجريبي
                'price' => 0,
            ]
        ];

        foreach ($offers as $offer) {
            Offer::create($offer);
        }

        $this->command->info('تم إنشاء بيانات العروض بنجاح!');
    }
}
