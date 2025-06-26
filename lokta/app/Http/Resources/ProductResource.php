<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Request;

class ProductResource extends JsonResource
{
   public function toArray($request)
    {
        try {
            return [
                'id' => $this->id,
                'title' => $this->title ?? null,
                'price' => $this->price ?? null,
                'currency' => $this->currency ?? null,
                'status' => $this->status ?? null,
                'images' => $this->formatImages() ?? null,
                'subscription_price' => $this->subscription_price ?? null,
                'description' => $this->description ?? null,
                'city' => $this->city ?? null,
                'is_show_payment' => $this->is_show_payment ?? null,

                'sub_category_id' => optional($this->sub_category)->id ?? null,
                'sub_category' => optional($this->sub_category)->title ?? null,
                'brand' => optional($this->brand)->name ?? null,
                'offer_id' => optional($this->offer)->id ?? null,
                'owner_id' => optional($this->owner)->id ?? null,
                'payment_details' => [
                    'method' => optional($this->paymentway)->title ?? null,
                    'inputs' => optional($this)->getProcessedPaymentInputs() ?? null,
                    'verification_status' => optional($this)->getVerificationStatus() ?? null
                ],
                'dates' => [
                    'start_date' => $this->start_date ?? null,
                    'end_date' => $this->end_date ?? null,
                    'remaining_days' => $this->end_date ? now()->diffInDays($this->end_date) : null
                ]
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'فشل في جلب المنتجات: ' . $e->getMessage()
            ];
        }
    }

    protected function formatImages()
    {
        // إذا كان images فارغًا أو غير موجود، نعيد مصفوفة فارغة
        if (empty($this->images)) {
            return [];
        }

        // إذا كان images بالفعل مصفوفة، نعيدها مباشرة
        if (is_array($this->images)) {
            return $this->images;
        }

        // إذا كان سلسلة نصية، نحاول فك تشفيرها
        if (is_string($this->images)) {
            $imagesArray = json_decode($this->images, true);
            return is_array($imagesArray) ? $imagesArray : [];
        }

        // في أي حالة أخرى نعيد مصفوفة فارغة
        return [];
    }
}
