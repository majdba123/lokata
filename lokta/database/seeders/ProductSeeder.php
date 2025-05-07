<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use App\Models\Product;
use App\Models\Offer;
use App\Models\Paymentway;
use App\Models\Paymentway_input;
use Carbon\Carbon;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // الحصول على العروض وطرق الدفع مع علاقاتها
        $offers = Offer::all();
        $paymentways = Paymentway::with('Paymentway_input')->get();

        foreach (range(1, 5) as $index) {
            $offer = $offers->random();
            $paymentway = $paymentways->random();

            // إنشاء بيانات الدفع المخصصة بناءً على حقول الإدخال
            $paymentInputs = [];
            foreach ($paymentway->Paymentway_input as $input) {
                $paymentInputs[$input->name] = $this->generatePaymentInputValue($input->type, $faker);
            }

            $startDate = $faker->dateTimeBetween('-1 month', '+1 month');
            $endDate = $offer->count_month > 0
                ? Carbon::parse($startDate)->addMonths($offer->count_month)
                : null;

            Product::create([
                'title' => $faker->word,
                'description' => $faker->sentence,
                'currency' => $faker->randomElement(['sy', 'us']),
                'price' => $faker->randomFloat(2, 10, 1000),
                'images' => json_encode([
                    "https://picsum.photos/seed/picsum/300/300",
                    "https://picsum.photos/seed/product{$index}/300/300"
                ]),
                'sub__category_id' => rand(1, 20),
                'owner_id' => rand(1, 10),
                'brand_id' => rand(1, 10),
                'offer_id' => $offer->id,
                'paymentway_id' => $paymentway->id,
                'status' => $faker->randomElement(['pending', 'rejected', 'completed']),
                'start_date' => $offer->count_month > 0 ? $startDate : null,
                'end_date' => $endDate,
                'payment_inputs' => json_encode($paymentInputs)
            ]);
        }
    }

    protected function generatePaymentInputValue($type, $faker)
    {
        return match($type) {
            '0' => $faker->word, // نص عادي
            '1' => "1271927912", // رقم هاتف
            '2' => "https://picsum.photos/seed/payment/300/300", // صورة
            default => $faker->word
        };
    }
}
