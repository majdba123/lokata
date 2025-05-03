<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'level',       //   1 2 3
        'discription',
        'count_month',
        'price'
    ];


    public function Product()
    {
        return $this->hasMany(Product::class);
    }
}
