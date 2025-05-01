<?php

namespace App\Http\Controllers;

use App\Models\Paymentway;
use App\Models\Paymentway_input;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PaymentwayInputController extends Controller
{

    public function store(Request $request, $paymentwayId)
    {
        $paymentway = Paymentway::find($paymentwayId);

        if (!$paymentway) {
            return response()->json([
                'success' => false,
                'message' => 'طريقة الدفع غير موجودة'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'type' => 'required|in:0,1,2',
            'name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $input = $paymentway->Paymentway_input()->create([
            'type' => $request->type,
            'name' => $request->name,
        ]);

        return response()->json([
            'success' => true,
            'data' => $input,
            'message' => 'تم إضافة حقل الإدخال بنجاح'
        ], 201);
    }

    /**
     * عرض حقل إدخال معين
     */
    public function show($id)
    {
        $paymentway_input = Paymentway_input::find($id);

        return response()->json([
            'success' => true,
            'data' => $paymentway_input,
            'message' => 'تفاصيل حقل الإدخال'
        ], 200);
    }

    /**
     * تحديث حقل إدخال معين
     */
    public function update(Request $request, $id)
    {
        $paymentway_input = Paymentway_input::find($id);

        $validator = Validator::make($request->all(), [
            'type' => 'sometimes|in:0,1,2',
            'name' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $paymentway_input->update($request->only(['type', 'name']));

        return response()->json([
            'success' => true,
            'data' => $paymentway_input,
            'message' => 'تم تحديث حقل الإدخال بنجاح'
        ], 200);
    }

    /**
     * حذف حقل إدخال معين
     */
    public function destroy( $id)
    {
        $paymentway_input = Paymentway_input::find($id);

        $paymentway_input->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم حذف حقل الإدخال بنجاح'
        ], 200);
    }
}
