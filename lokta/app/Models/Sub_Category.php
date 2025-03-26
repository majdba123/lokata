<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sub_Category extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'image',
    ];


    public function product()
    {
        return $this->hasMany(Product::class);
    }

}
