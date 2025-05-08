<?php

namespace Database\Seeders;

use App\Models\CategoryNavbar;
use Illuminate\Database\Seeder;

class CategoryNavbarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // تحديد الـ IDs للفئات التي نريد إضافتها للـ navbar
        $categoryIdsToAdd = [1, 2, 3, 4]; // يمكن تغيير هذه حسب احتياجاتك

        // استدعاء الدالة التي أنشأناها في المودل
        CategoryNavbar::addCategories($categoryIdsToAdd);

        $this->command->info('تم إضافة 4 فئات إلى القائمة الرئيسية بنجاح!');
    }
}
