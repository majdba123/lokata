<?php

namespace App\Http\Controllers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests\registartion\RegisterUser ; // Ensure the namespace is correct
use App\services\registartion\register; // Ensure the namespace is correct\use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendOtpMail;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use App\Helpers\OtpHelper;
class RegisterController extends Controller
{
    protected $userService;

    public function __construct(register $userService)
    {
        $this->userService = $userService;
    }

    public function register(RegisterUser $request): JsonResponse
    {
        $validatedData = $request->validated();

        // Pass the modified request data to the service
        $user = $this->userService->register($validatedData);

        if (isset($validatedData['email'])) {
             OtpHelper::sendVerificationEmail($user->id);
        }

        return response()->json([
            'message' => 'User  registered successfully',
            'user' => $user,
        ], 201);
    }



    public function verification_otp(Request $request)
    {
        // Validate the request
        $request->validate([
            'otp' => 'required|string|size:6', // Ensure OTP is a string of size 6
        ]);

        // Get the authenticated user
        $user = Auth::user();

        // Check if the user is authenticated
        if (!$user) {
            return response()->json(['message' => 'User  not authenticated.'], 401);
        }

        try {
            // Call the verifyOtp method from the service
            $this->userService->verifyOtp($request->input('otp'), $user);

            return response()->json(['message' => 'OTP verified successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }




    public function verifyEmail(Request $request)
    {
        $id = $request->query('id');
        $token = $request->query('token');

        $cachedToken = Cache::get('verify_' . $id);

        if ($cachedToken && $cachedToken === $token) {
            $user = User::findOrFail($id);
            $user->email_verified_at = now();
            $user->save();

            // حذف الرمز من الكاش بعد التحقق
            Cache::forget('verify_' . $id);

            return response()->json(['message' => 'تم التحقق من البريد الإلكتروني بنجاح!'], 200);
        }

        return response()->json(['error' => 'رمز التحقق غير صالح أو منتهي الصلاحية.'], 400);
    }
}

