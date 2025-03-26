<?php

use App\Http\Controllers\LogInController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ForgetPasswordController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\FileUploadController;

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




Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LogInController::class, 'login']);
Route::post('/forget-password', [ForgetPasswordController::class, 'forgetPassword']);
Route::post('/reset-password', [ForgetPasswordController::class, 'resetPasswordByVerifyOtp']);

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });


    Route::put('/user', [UserController::class, 'update']);
    Route::put('/user/change-password', [UserController::class, 'changePassword']);
    Route::get('/user/verify-otp', [RegisterController::class, 'verification_otp']);
    Route::post('/logout', [LogInController::class, 'logout']);
    Route::get('/possible-chat-user/{vendor_id}', [UserController::class, 'possibleChatUser']);
});


Route::group(['middleware' => ['auth:sanctum', 'admin']], function () {
    Route::post('/admin/subcategories', [SubCategoryController::class, 'create']);
    Route::put('/admin/subcategories/{subCategory}', [SubCategoryController::class, 'update']);
    Route::delete('/admin/subcategories/{subCategory}', [SubCategoryController::class, 'destroy']);
});

Route::group(['middleware' => ['auth:sanctum', 'vendor']], function () {
    Route::get('/my-products', [ProductController::class, 'myProducts']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    Route::delete('/brands/{brand}', [BrandController::class, 'destroy']);
    Route::put('/brands/{brand}', [BrandController::class, 'update']);
    Route::post('/brands', [BrandController::class, 'store']);

});



Route::get('/subcategories', [SubCategoryController::class, 'allSubCategories']);
Route::get('/subcategories-with-products', [SubCategoryController::class, 'allSubCategoriesWithLatestProducts']);
Route::get('/products/filter', [ProductController::class, 'filterProducts']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/products/subcategories/{subCategoryId}', [ProductController::class, 'getProductsBySubCategory']);
Route::get('/brands', [BrandController::class, 'index']);
Route::get('/brands/{brand}', [BrandController::class, 'index']);




Route::post('/SendTo/{recive_id}', [ChatController::class, 'sendMessage'])->middleware('auth:sanctum');
Route::get('/unread-messages', [ChatController::class, 'getUnreadMessages'])->middleware('auth:sanctum');
Route::post('/mark-messages-as-read/{sender_id}', [ChatController::class, 'markMessagesAsRead'])->middleware('auth:sanctum');
Route::get('/getInteractedUsers', [ChatController::class, 'getInteractedUsers'])->middleware('auth:sanctum');
Route::get('/getConversation/{reciver_id}', [ChatController::class, 'getConversation'])->middleware('auth:sanctum');
Route::post('/upload', [FileUploadController::class, 'upload'])->middleware('auth:sanctum');




/*Route::get('/messages-from-sender/{sender_id}', [ChatController::class, 'getMessagesFromSender'])->middleware('auth:sanctum');
Route::get('/getMessagesByReceiver/{reciver_id}', [ChatController::class, 'getMessagesByReceiver'])->middleware('auth:sanctum');
*/
