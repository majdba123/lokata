<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;
use Carbon\Carbon;

class CheckExpiredProducts extends Command
{
    protected $signature = 'products:check-expired';
    protected $description = 'Update status of expired products';

    public function handle()
    {
        $now = Carbon::now();

        Product::where('status', 'completed')
               ->where('end_date', '<=', $now)
               ->update(['status' => 'expired']);

        $this->info('Expired products have been updated successfully.');
    }
}
