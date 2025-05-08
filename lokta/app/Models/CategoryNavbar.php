<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoryNavbar extends Model
{
    use HasFactory;

    protected $fillable = ['category_id'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public static function addCategories(array $categoryIds)
    {
        $existing = self::whereIn('category_id', $categoryIds)->pluck('category_id')->toArray();

        foreach (array_diff($categoryIds, $existing) as $categoryId) {
            self::create(['category_id' => $categoryId]);
        }
    }
}
