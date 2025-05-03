<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('products:check-expired')
                 ->everyTwoMinutes() // تعمل كل دقيقتين
                 ->appendOutputTo(storage_path('logs/expired_products.log'));
    }

    protected $commands = [
        \App\Console\Commands\CheckExpiredProducts::class,
    ];
}
