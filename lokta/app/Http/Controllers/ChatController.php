<?php

namespace App\Http\Controllers;

use App\Models\chat;
use App\Models\User;
use Illuminate\Http\Request;
use App\Events\chat1;

class ChatController extends Controller
{


    public function sendMessage(Request $request ,$receiver_id)
    {
        $message = Chat::create([
            'sender_id' => auth()->id(),
            'receiver_id' => $receiver_id,
            'message' => $request->message,
        ]);

        broadcast(new chat1($message))->toOthers();

        return response()->json(['status' => 'Message sent successfully!']);
    }



    public function getMessagesFromSender($sender_id)
    {
        $receiver_id = auth()->id(); // المستخدم الموثق هو المستقبل
        $messages = Chat::where('sender_id', $sender_id)
            ->where('receiver_id', $receiver_id)
            ->orderBy('created_at', 'desc')
            ->paginate(10, ['message', 'created_at']); // تقسيم النتائج إلى صفحات (10 رسائل لكل صفحة)

        return response()->json($messages);
    }



    public function getUnreadMessages()
    {
        $receiver_id = auth()->id(); // المستخدم الموثق هو المستقبل

        // جلب الرسائل غير المقروءة
        $unreadMessages = Chat::where('receiver_id', $receiver_id)
            ->where('is_read', false) // شرط الرسائل غير المقروءة
            ->orderBy('created_at', 'desc')
            ->paginate(10, ['message', 'created_at']); // تقسيم النتائج إلى صفحات (10 رسائل لكل صفحة)


        // التحقق إذا لم توجد رسائل غير مقروءة
        if ($unreadMessages->isEmpty()) {
            return response()->json(['message' => 'No unread messages found.']);
        }

        // إعادة الرسائل غير المقروءة مع معرّف المرسل
        return response()->json($unreadMessages);
    }



    public function markMessagesAsRead($sender_id)
    {
        $receiver_id = auth()->id(); // المستخدم الموثق هو المستقبل

        // تحديث حالة الرسائل غير المقروءة
        $updatedRows = Chat::where('sender_id', $sender_id)
            ->where('receiver_id', $receiver_id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        // استجابة
        if ($updatedRows > 0) {
            return response()->json(['message' => 'Messages marked as read.']);
        }

        return response()->json(['message' => 'No unread messages found to mark as read.']);
    }







}
