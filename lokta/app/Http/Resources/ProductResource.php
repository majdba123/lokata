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
            'sub_category_id' => $this->sub_category->id,
            'sub_category' => $this->sub_category->title,
            'brand' => $this->brand?->name,
            'offer_id' => $this->offer->id,
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
        // Decode the JSON string to an array
        $imagesArray = json_decode($this->images, true);

        // If decoding fails or result is not an array, return an empty array
        if (!is_array($imagesArray)) {
            return [];
        }

        // Map each image URL to include additional properties if needed
        return array_map(function ($imageUrl) {
            return $imageUrl;
        }, $imagesArray);
    }
}
