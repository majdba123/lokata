<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\registartion\LoginRequest ; // Ensure the namespace is correct
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use App\Services\registartion\login;
class LogInController extends Controller
{
    protected $loginService;

    public function __construct(login $loginService)
    {
        $this->loginService = $loginService;
    }



   public function login(LoginRequest $request): JsonResponse
   {
       // The validated data is automatically available from the request
       $validatedData = $request->validated();

       $token = $this->loginService->login($validatedData);

       return response()->json([
           'access_token' => $token,
       ]);
   }


   public function logout(){
       auth()->user()->tokens()->delete();

       return response()->json([
         "message"=>"logged out"
       ]);
   }
}
