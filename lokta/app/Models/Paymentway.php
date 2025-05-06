<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paymentway extends Model
{
    use HasFactory;


    protected $fillable = [
        'title',
        'image',
        'description',

    ];

    public function Paymentway_input()
    {
        return $this->hasMany(Paymentway_input::class);
    }
    public function Product()
    {
        return $this->hasMany(Product::class);
    }

}
