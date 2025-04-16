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

// Authenticated routes with email verification
Route::group(['middleware' => ['auth:sanctum', 'verified']], function () {
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
});

// Admin routes (don't require email verification)
Route::group(['middleware' => ['auth:sanctum', 'admin']], function () {
    Route::post('/admin/subcategories', [SubCategoryController::class, 'create']);
    Route::put('/admin/subcategories/{subCategory}', [SubCategoryController::class, 'update']);
    Route::delete('/admin/subcategories/{subCategory}', [SubCategoryController::class, 'destroy']);
});