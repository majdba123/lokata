<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',

    ];

    public function user()
    {
        return $this->belongsTo(User::class ,'user_id');
    }

    public function product()
    {
        return $this->hasMany(Product::class);
    }


}
