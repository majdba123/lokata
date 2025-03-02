<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'vendor_id',
        'sub_category_id',
        'image',
        'price',
        'discreption',
    ];

    public function OrderProduct()
    {
        return $this->hasMany(OrderProduct::class);
    }

    public function sub_category()
    {
        return $this->belongsTo(Sub_Category::class ,'sub_category_id');
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class ,'vendor_id');
    }

}
