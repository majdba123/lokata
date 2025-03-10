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



    public function getInteractedUsers(Request $request)
    {
        $userId = auth()->id(); // المعرّف الخاص بالمستخدم الموثق

        // جلب جميع الأشخاص الذين قام المستخدم بمراسلتهم أو قاموا بمراسلته، مع استثناء سجلات المستخدم نفسه
        $interactedUsers = Chat::where(function ($query) use ($userId) {
                $query->where('sender_id', $userId)
                      ->orWhere('receiver_id', $userId);
            })
            ->join('users', function ($join) use ($userId) {
                $join->on('users.id', '=', 'chats.sender_id')
                     ->orOn('users.id', '=', 'chats.receiver_id');
            })
            ->where('users.id', '!=', $userId) // استثناء المستخدم الموثق نفسه
            ->orderBy('chats.created_at', 'desc') // ترتيب النتائج من الأحدث إلى الأقدم
            ->distinct()
            ->paginate(10, ['users.id', 'users.name']); // تقسيم النتائج إلى صفحات (10 عناصر لكل صفحة)

        // إرجاع النتيجة مع التجزئة
        return response()->json($interactedUsers);
    }




    public function getMessagesByReceiver($receiver_id)
    {
        $sender_id = auth()->id(); // المستخدم الموثق هو المرسل

        // جلب الرسائل بين المرسل والمستقبل
        $messages = Chat::where(function ($query) use ($sender_id, $receiver_id) {
            $query->where('sender_id', $sender_id)
                  ->where('receiver_id', $receiver_id);
        })->orWhere(function ($query) use ($sender_id, $receiver_id) {
            $query->where('sender_id', $receiver_id)
                  ->where('receiver_id', $sender_id);
        })
        ->orderBy('created_at', 'asc') // ترتيب الرسائل حسب وقت الإرسال
        ->paginate(10, ['message', 'created_at']); // تقسيم النتائج إلى صفحات (10 رسائل لكل صفحة)

        // التحقق إذا لم توجد رسائل
        if ($messages->isEmpty()) {
            return response()->json(['message' => 'No messages found with this receiver.']);
        }

        // إعادة الرسائل
        return response()->json($messages);
    }


    public function getConversation($user_id)
    {
        $authUserId = auth()->id(); // المعرّف الخاص بالمستخدم الحالي (الموثق)

        // جلب جميع الرسائل بين المستخدم الحالي والشخص الآخر
        $conversation = Chat::where(function ($query) use ($authUserId, $user_id) {
                $query->where('sender_id', $authUserId)
                    ->where('receiver_id', $user_id);
            })
            ->orWhere(function ($query) use ($authUserId, $user_id) {
                $query->where('sender_id', $user_id)
                    ->where('receiver_id', $authUserId);
            })
            ->orderBy('created_at', 'asc') // ترتيب الرسائل حسب وقت الإرسال
            ->get(['message', 'sender_id', 'receiver_id', 'created_at']); // جلب الرسائل وبعض المعلومات

        // إذا لم توجد رسائل بين المستخدمين
        if ($conversation->isEmpty()) {
            return response()->json(['message' => 'No conversation found with this user.']);
        }

        // إعادة المحادثة
        return response()->json($conversation);
    }




}
