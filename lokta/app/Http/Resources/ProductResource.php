<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Request;


class ProductResource extends JsonResource
{

       public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'price' => $this->price,
            'currency' => $this->currency,
            'status' => $this->status,
            'images' => $this->formatImages(),
            'subscription_price' => $this->subscription_price,
            'description' => $this->description,
            'city' => $this->city,

            'sub_category_id' => $this->sub_category->id,
            'sub_category' => $this->sub_category->title,
            'brand' => $this->brand?->name,
            'offer_id' => $this->offer->id,
            'owner_id' => $this->owner->id,
            'payment_details' => [
                'method' => $this->paymentway->title,
                'inputs' => $this->getProcessedPaymentInputs(),
                'verification_status' => $this->getVerificationStatus()
            ],
            'dates' => [
                'start_date' => $this->start_date,
                'end_date' => $this->end_date,
                'remaining_days' => $this->end_date ? now()->diffInDays($this->end_date) : null
            ]
        ];
    }

    protected function formatImages()
    {
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
