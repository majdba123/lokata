<?php
use App\Http\Controllers\ChatController;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\RegisterController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});




Route::get('/verify-email', function (Request $request) {
    $token = $request->query('token');
    $id = $request->query('id');

    if (Cache::get('verify_' . $id) === $token) {
        User::findOrFail($id)->update(['email_verified_at' => now()]);
        Cache::forget('verify_' . $id);
        return view('emails.verify_success'); // Success view
    }

    return view('emails.verify_failed'); // Error view
});

Route::get('/chat', function () {
    return view('chat');
})->middleware('auth');





Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');




/**tessst */


Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
