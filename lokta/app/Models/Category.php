<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'imag',
    ];



    public function sub_category()
    {
        return $this->hasMany(Sub_Category::class);
    }




}
