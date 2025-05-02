<?php

use App\Http\Controllers\LogInController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ForgetPasswordController;
use App\Http\Controllers\PaymentwayController;
use App\Http\Controllers\PaymentwayInputController;
use App\Http\Controllers\OfferController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\FileUploadController;
use App\Helpers\OtpHelper;
use App\Http\Controllers\Category\CategoryController;

use App\Models\User;
use Illuminate\Support\Facades\Cache;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LogInController::class, 'login']);
Route::post('/forget-password', [ForgetPasswordController::class, 'forgetPassword']);
Route::post('/reset-password', [ForgetPasswordController::class, 'resetPasswordByVerifyOtp']);

// Public product routes
Route::get('/subcategories', [SubCategoryController::class, 'allSubCategories']);
Route::get('/subcategories-with-products', [SubCategoryController::class, 'allSubCategoriesWithLatestProducts']);
Route::get('/products/filter', [ProductController::class, 'filterProducts']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/products/subcategories/{subCategoryId}', [ProductController::class, 'getProductsBySubCategory']);
Route::get('/brands', [BrandController::class, 'index']);
Route::get('/brands/{brand}', [BrandController::class, 'show']);






/**majd here  */


Route::prefix('categories')->group(function () {
    Route::get('get_all', [CategoryController::class, 'index']);
    Route::get('show/{id}', [CategoryController::class, 'show']);
    Route::get('get_sub_category_by_category/{category_id}/', [CategoryController::class, 'get_by_category']); // عرض جميع الفئات الفرعية

});

// Authenticated routes with email verification
Route::group(['middleware' => ['auth:sanctum', 'verified.email']], function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::put('/user', [UserController::class, 'update']);
    Route::put('/user/change-password', [UserController::class, 'changePassword']);
    Route::get('/user/verify-otp', [RegisterController::class, 'verification_otp']);
    Route::post('/logout', [LogInController::class, 'logout']);
    Route::get('/possible-chat-user/{vendor_id}', [UserController::class, 'possibleChatUser']);

    // Product routes for verified users
    Route::get('/my-products', [ProductController::class, 'myProducts']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    // Brand routes for verified users
    Route::post('/brands', [BrandController::class, 'store']);
    Route::put('/brands/{brand}', [BrandController::class, 'update']);
    Route::delete('/brands/{brand}', [BrandController::class, 'destroy']);

    // Chat routes for verified users
    Route::post('/SendTo/{recive_id}', [ChatController::class, 'sendMessage']);
    Route::get('/unread-messages', [ChatController::class, 'getUnreadMessages']);
    Route::post('/mark-messages-as-read/{sender_id}', [ChatController::class, 'markMessagesAsRead']);
    Route::get('/getInteractedUsers', [ChatController::class, 'getInteractedUsers']);
    Route::get('/getConversation/{reciver_id}', [ChatController::class, 'getConversation']);
    Route::post('/upload', [FileUploadController::class, 'upload']);

    Route::prefix('paymentways')->group(function () {
        Route::get('get_all/', [PaymentwayController::class, 'index']); // عرض الكل
        Route::get('show/{id}', [PaymentwayController::class, 'show']); // عرض واحدة
        Route::get('get_input_payment/{id}', [PaymentwayController::class, 'showInputs']); // عرض حقول واحدة
    });


    Route::prefix('offers')->group(function () {
        // عرض جميع العروض مع إمكانية الفلترة
        Route::get('/fillter', [OfferController::class, 'index']);
        Route::get('show/{id}', [OfferController::class, 'show']);

    });
});

// Admin routes (don't require email verification)
Route::group(['middleware' => ['auth:sanctum', 'admin']], function () {
    Route::post('/admin/subcategories', [SubCategoryController::class, 'create']);
    Route::put('/admin/subcategories/{subCategory}', [SubCategoryController::class, 'update']);
    Route::delete('/admin/subcategories/{subCategory}', [SubCategoryController::class, 'destroy']);



    Route::prefix('admin')->group(function () {
        Route::get('categories/get_all', [CategoryController::class, 'index']);
        Route::post('categories/store', [CategoryController::class, 'store']);
        Route::post('categories/update/{id}', [CategoryController::class, 'update']);
        Route::delete('categories/delete/{id}', [CategoryController::class, 'destroy']);
        Route::get('categories/show/{id}', [CategoryController::class, 'show']);
        Route::get('categories/get_sub_category_by_category/{category_id}/', [CategoryController::class, 'get_by_category']); // عرض جميع

        Route::prefix('paymentways')->group(function () {
            Route::get('get_all/', [PaymentwayController::class, 'index']); // عرض الكل
            Route::post('store/', [PaymentwayController::class, 'store']); // إنشاء جديد
            Route::get('show/{id}', [PaymentwayController::class, 'show']); // عرض واحدة
            Route::get('get_input_payment/{id}', [PaymentwayController::class, 'showInputs']); // عرض حقول واحدة
            Route::put('update_payment/{id}', [PaymentwayController::class, 'update']); // تعديل
            Route::delete('delete_payment/{id}', [PaymentwayController::class, 'destroy']); // حذف
        });


        Route::prefix('paymentways_inputs')->group(function () {
            Route::post('store/{payment_id}', [PaymentwayInputController::class, 'store']);
            Route::get('show/{input}', [PaymentwayInputController::class, 'show']);
            Route::put('update/{input}', [PaymentwayInputController::class, 'update']);
            Route::delete('delete/{input}', [PaymentwayInputController::class, 'destroy']);
        });


        Route::prefix('offers')->group(function () {
            // عرض جميع العروض مع إمكانية الفلترة
            Route::get('/fillter', [OfferController::class, 'index']);
            Route::post('store/', [OfferController::class, 'store']);
            Route::get('show/{id}', [OfferController::class, 'show']);
            Route::put('update/{id}', [OfferController::class, 'update']);
            Route::delete('delete/{id}', [OfferController::class, 'destroy']);
        });

    });

});








Route::middleware(['auth:sanctum'])->post('/resend_verification', function () {
    return OtpHelper::resendVerificationEmail(auth()->id());
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




