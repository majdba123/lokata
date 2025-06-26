<?php

namespace App\Http\Controllers;

use App\Models\Paymentway;
use App\Models\PaymentwayInput;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PaymentwayController extends Controller
{
    /**
     * عرض جميع طرق الدفع مع حقولها
     */
    public function index(Request $request)
    {
    // التحقق من صلاحيات المستخدم
        $user = Auth::user();
        $isAdmin = $user && $user->role === 'admin';

        // بناء الاستعلام الأساسي
        $query = Paymentway::with('Paymentway_input')
                    ->where('id', '!=', 1); // استبعاد البوابة الافتراضية

        // إذا لم يكن مديراً، نضيف شرط status = 1
        if (!$isAdmin) {
            $query->where('status', 1);
        }

        // تنفيذ الاستعلام
        $paymentways = $query->get();

        // إضافة تحقق إضافي إذا لزم الأمر
        if ($paymentways->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'لا توجد بوابات دفع متاحة'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'is_admin' => $isAdmin, // إرسال معلومات الصلاحية للفرونت إن لزم
            'data' => $paymentways
        ], 200);
    }
    /**
     * عرض طريقة دفع معينة مع حقولها
     */
    public function show($id)
    {
        $paymentway = Paymentway::with('Paymentway_input')->find($id);

        if (!$paymentway) {
            return response()->json([
                'success' => false,
                'message' => 'طريقة الدفع غير موجودة'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $paymentway
        ], 200);
    }

    /**
     * تخزين طريقة دفع جديدة مع حقولها
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // إضافة التحقق من الصورة
            'inputs' => 'required|array',
            'inputs.*.type' => 'required|in:0,1,2',
            'inputs.*.name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imageFile = $request->file('image');
            $imageName = Str::random(32) . '.' . $imageFile->getClientOriginalExtension();
            $imagePath = 'paymentways/' . $imageName;
            Storage::disk('public')->put($imagePath, file_get_contents($imageFile));
        }

        $paymentway = Paymentway::create([
            'title' => $request->title,
            'description' => $request->description,
            'image' => $imagePath ? asset('api/storage/' . $imagePath) : null, // تخزين المسار الكامل
        ]);

        foreach ($request->inputs as $input) {
            $paymentway->Paymentway_input()->create([
                'type' => $input['type'],
                'name' => $input['name'],
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $paymentway->load('Paymentway_input'),
            'message' => 'تم إنشاء طريقة الدفع بنجاح'
        ], 201);
    }

    /**
     * تعديل اسم ووصف طريقة الدفع
     */
    public function update(Request $request, $id)
    {
        $paymentway = Paymentway::find($id);

        if (!$paymentway) {
            return response()->json([
                'success' => false,
                'message' => 'طريقة الدفع غير موجودة'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // إضافة التحقق من الصورة
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only(['title', 'description']);

        if ($request->hasFile('image')) {
            // حذف الصورة القديمة إذا كانت موجودة
            if ($paymentway->image) {
                $oldImagePath = str_replace(asset('storage/'), '', $paymentway->image);
                Storage::disk('public')->delete($oldImagePath);
            }

            $imageFile = $request->file('image');
            $imageName = Str::random(32) . '.' . $imageFile->getClientOriginalExtension();
            $imagePath = 'paymentways/' . $imageName;
            Storage::disk('public')->put($imagePath, file_get_contents($imageFile));
            $data['image'] = asset('api/storage/' . $imagePath);
        }

        $paymentway->update($data);

        return response()->json([
            'success' => true,
            'data' => $paymentway,
            'message' => 'تم تحديث طريقة الدفع بنجاح'
        ], 200);
    }

    /**
     * تعديل حقول الإدخال لطريقة الدفع
     */



    public function showInputs($id)
    {
        $paymentway = Paymentway::with('Paymentway_input')->find($id);

        if (!$paymentway) {
            return response()->json([
                'success' => false,
                'message' => 'طريقة الدفع غير موجودة'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $paymentway->Paymentway_input,
            'message' => 'حقول الإدخال لطريقة الدفع'
        ], 200);
    }


/**
 * حذف طريقة الدفع
 */
public function destroy(Request $request,$id)
{
    // التحقق من صحة البيانات المدخلة
    $request->validate([
        'status' => 'required|in:0,1', // يجب أن تكون القيمة 0 أو 1 فقط
    ]);

    // منع تعديل بوابة الدفع الافتراضية (id = 1)
    if ($id == 1) {
        return response()->json([
            'success' => false,
            'message' => 'لا يمكن تعديل حالة بوابة الدفع الافتراضية'
        ], 403); // كود 403 Forbidden
    }

    // البحث عن طريقة الدفع
    $paymentway = Paymentway::find($id);

    if (!$paymentway) {
        return response()->json([
            'success' => false,
            'message' => 'طريقة الدفع غير موجودة'
        ], 404);
    }

    // تحديث حالة طريقة الدفع
    $paymentway->update(['status' => $request->status]);

    // رسالة الاستجابة حسب الحالة
    $statusMessage = $request->status == 1 ? 'تم تفعيل طريقة الدفع بنجاح' : 'تم تعطيل طريقة الدفع بنجاح';

    return response()->json([
        'success' => true,
        'message' => $statusMessage,
        'data' => $paymentway
    ], 200);
}
}
