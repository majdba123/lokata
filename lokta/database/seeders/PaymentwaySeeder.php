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


        // 1. طريقة الدفع عبر البنك
        $bankTransfer = Paymentway::create([
            'title' => 'التحويل البنكي',
            'description' => 'قم بإجراء تحويل بنكي إلى الحساب المحدد'
        ]);

        // حقول إدخال طريقة التحويل البنكي
        Paymentway_input::create([
            'paymentway_id' => $bankTransfer->id,
            'name' => 'bank_name',
            'type' => '0', // نص
        ]);

        Paymentway_input::create([
            'paymentway_id' => $bankTransfer->id,
            'name' => 'account_number',
            'type' => '0', // نص
        ]);

        Paymentway_input::create([
            'paymentway_id' => $bankTransfer->id,
            'name' => 'transfer_receipt',
            'type' => '2', // صورة
        ]);

        // 2. طريقة الدفع عبر ويسترن يونيون
        $westernUnion = Paymentway::create([
            'title' => 'ويسترن يونيون',
            'description' => 'إرسال الأموال عبر ويسترن يونيون'
        ]);

        Paymentway_input::create([
            'paymentway_id' => $westernUnion->id,
            'name' => 'name',
            'type' => '0', // نص
        ]);

        Paymentway_input::create([
            'paymentway_id' => $westernUnion->id,
            'name' => 'phone',
            'type' => '1', // نص
        ]);

        // 3. الدفع عند الاستلام
        $cashOnDelivery = Paymentway::create([
            'title' => 'الدفع عند الاستلام',
            'description' => 'سدد عند استلام المنتج'
        ]);

        Paymentway_input::create([
            'paymentway_id' => $westernUnion->id,
            'name' => 'name',
            'type' => '0', // نص
        ]);

        Paymentway_input::create([
            'paymentway_id' => $westernUnion->id,
            'name' => 'image',
            'type' => '2', // نص
        ]);


        $this->command->info('تم إنشاء بيانات طرق الدفع وحقول الإدخال بنجاح!');
    }
}
