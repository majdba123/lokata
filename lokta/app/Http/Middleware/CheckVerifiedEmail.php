<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckVerifiedEmail
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        
        if (!$user || !$user->email_verified_at) {
            return response()->json([
                'message' => 'should be verifiedاً'
            ], 403);
        }

        return $next($request);
    }
}