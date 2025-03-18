<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{

    public function update(Request $request)
    {
        $request->validate([
            'name' => 'nullable|string|max:255|unique:users,name,' . auth()->id() . ',id',
            'image' => 'nullable|string'
        ]);
        $user = User::where('id', auth()->id())->firstOrFail();
        $user->update($request->all());
        return response()->json(['message' => 'Account Updated Successfully', 'data' => $user]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'currentPassword' => 'required|string|min:8',
            'newPassword' => 'required|string|min:8',
        ]);

        $user = User::where('id', auth()->id())->firstOrFail();

        if (!$user || !Hash::check($request['currentPassword'], $user->password)) {
            return response()->json(['message' => 'Invalid Credentials'], 401);
        }

        $user->password = Hash::make($request['newPassword']);
        $user->save();

        return response()->json(['message' => 'Password Changed Successfully']);
    }

    public function possibleChatUser(Request $request, int $vendor_id) : JsonResponse
    {


        $user = User::where('id', $vendor_id)->select('id', 'name')->firstOrFail();

        return response()->json($user);

    }
}
