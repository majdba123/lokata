<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    use HasFactory;

    protected $fillable = [
        'sub__category_id',
        'name',
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function subcategory()
    {
        return $this->belongsTo(Sub_Category::class ,'sub__category_id');
    }


    public function category()
    {
        return $this->hasOneThrough(
            Category::class,
            Sub_Category::class,
            'id', // Foreign key on Sub_Category table
            'id', // Foreign key on Category table
            'sub__category_id', // Local key on Brand table
            'category_id' // Local key on Sub_Category table
        );
    }
}
