import { useChatStore } from "@/zustand-stores/chat-store";
import { MessageCircleQuestion } from "lucide-react";

function ChatNotifications() {
  const counter = useChatStore((state) => state.newMessagesCounter);

  const reloadPage = () => {
    window.location.reload();
  };
  if (counter === 0) return null;
  return (
    <div
      dir="rtl"
      className="flex flex-col items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm my-2.5"
    >
      <p className="flex items-center gap-2 font-medium text-gray-700">
        <MessageCircleQuestion className="w-5 h-5 text-blue-500" />
        {counter} رسائل جديدة
      </p>
      <button
        onClick={reloadPage}
        className="cursor-pointer text-xs text-blue-600 hover:text-blue-700 hover:underline transition-colors"
      >
        إعادة التحميل لرؤية الرسائل الجديدة
      </button>
    </div>
  );
}

export default ChatNotifications;
