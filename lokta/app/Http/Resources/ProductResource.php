<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Request;


class ProductResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'price' => $this->price,
            'images' => $this->formatImages(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'sub__category_id' => $this->sub__category_id,
            'vendor_id' => $this->vendor_id,
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
