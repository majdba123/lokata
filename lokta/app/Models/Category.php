<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'image',
        'description',
    ];


    public function subCategories()
    {
        return $this->hasMany(Sub_Category::class);
    }
}
