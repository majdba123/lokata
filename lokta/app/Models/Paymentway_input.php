<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paymentway_input extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_id',
        'type',    // 0,1,2
        'name',
    ];

    public function Paymentway_input()
    {
        return $this->belongsTo(Paymentway::class ,'payment_id');
    }
}
