<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'sub__category_id',
        'is_show_payment',
        'images',
        'price',
        'description',
        'brand_id',
        'city',
        'currency',
        'owner_id',
        'offer_id',
        'currency',
        'start_date',
        'end_date',
        'paymentway_id',
        'status', // pending, rejected, completed
        'payment_inputs', // JSON field to store payment inputs
        'subscription_price'
    ];

    protected $casts = [
        'images' => 'array',
    ];
    protected $appends = ['subscription_price']; // لإضافة الحقل تلقائياً عند جلب المنتج

    // علاقة الوصول لسعر الاشتراك من العرض
    public function getSubscriptionPriceAttribute()
    {
        return $this->offer ? $this->offer->price : null;
    }

    public function OrderProduct()
    {
        return $this->hasMany(OrderProduct::class);
    }

    public function sub_category()
    {
        return $this->belongsTo(Sub_Category::class ,'sub__category_id');
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    // generate relation with brand
    public function brand()
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }



    public function offer()
    {
        return $this->belongsTo(Offer::class ,'offer_id');
    }

    public function paymentway()
    {
        return $this->belongsTo(Paymentway::class);
    }




    public function getProcessedPaymentInputs()
    {
        $paymentInputs = json_decode($this->payment_inputs, true);
        $paymentwayInputs = $this->paymentway->paymentway_input;

        $processed = [];
        foreach ($paymentwayInputs as $input) {
            $value = $paymentInputs[$input->name] ?? null;

            if ($input->type == '2' && $value) {
                $value = [
                    'url' => $value,
                    'type' => 'image'
                ];
            }

            $processed[$input->name] = [
                'value' => $value,
                'type' => $this->getInputType($input->type),
                'required' => true
            ];
        }

        return $processed;
    }

    protected function getInputType($typeCode)
    {
        return match($typeCode) {
            '0' => 'text',
            '1' => 'phone',
            '2' => 'image',
            default => 'unknown'
        };
    }

    public function getVerificationStatus()
    {
        try {
            $this->verifyPaymentInputs();
            return 'verified';
        } catch (\Exception $e) {
            return 'unverified: ' . $e->getMessage();
        }
    }

    protected function verifyPaymentInputs()
    {
        $paymentInputs = json_decode($this->payment_inputs, true);
        $paymentwayInputs = $this->paymentway->paymentway_input;

        foreach ($paymentwayInputs as $input) {
            $value = $paymentInputs[$input->name] ?? null;

            if (empty($value)) {
                throw new \Exception("حقل {$input->name} فارغ");
            }

            if ($input->type == '1' && !preg_match('/^[0-9]{10,15}$/', $value)) {
                throw new \Exception("رقم الهاتف غير صالح في حقل {$input->name}");
            }
        }
    }

    public function scopeExpired($query)
    {
        return $query->where('status', 'complete')
                    ->where('end_date', '<=', now());
    }

    // يمكنك استدعاء هذا Scope في أي مكان: Product::expired()->get()

}
