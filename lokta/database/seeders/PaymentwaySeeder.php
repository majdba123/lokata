<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Paymentway;
use App\Models\Paymentway_input;

class PaymentwaySeeder extends Seeder
{
    public function run()
    {
        // مسح البيانات القديمة إذا وجدت

        // إنشاء وسيلة دفع واحدة فقط
        $paymentMethod = Paymentway::create([
            'title' => 'الدفع الإلكتروني',
            'description' => 'الدفع عبر التحويل الإلكتروني'
        ]);

        // حقول الإدخال المطلوبة
        Paymentway_input::create([
            'paymentway_id' => $paymentMethod->id,
            'name' => 'name',
            'type' => '0', // نص
        ]);

        Paymentway_input::create([
            'paymentway_id' => $paymentMethod->id,
            'name' => 'phone',
            'type' => '1', // هاتف
        ]);

        Paymentway_input::create([
            'paymentway_id' => $paymentMethod->id,
            'name' => 'image',
            'type' => '2', // صورة
        ]);

        $this->command->info('تم إنشاء وسيلة الدفع وحقول الإدخال بنجاح!');
    }
}
