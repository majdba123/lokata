<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'sub__category_id',
        'images',
        'price',
        'description',
        'brand_id',
        'owner_id'
    ];

    protected $casts = [
        'images' => 'array',
    ];

    public function OrderProduct()
    {
        return $this->hasMany(OrderProduct::class);
    }

    public function sub_category()
    {
        return $this->belongsTo(Sub_Category::class ,'sub__category_id');
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    // generate relation with brand
    public function brand()
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }

}
    