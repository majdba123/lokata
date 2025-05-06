<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sub_Category extends Model
{
    use HasFactory;
    protected $fillable = [
        'category_id',
        'title',
        'image',
    ];


    public function product()
    {
        return $this->hasMany(Product::class);
    }

    public function brand()
    {
        return $this->hasMany(Brand::class);
    }



    public function user()
    {
        return $this->belongsTo(Category::class ,'category_id');
    }

}
