import ChatSidebar from "./chat-sidebar";
import ChatArea from "./chat-area";
import { useChatStore } from "@/zustand-stores/chat-store";
import { useAuthStore } from "@/zustand-stores/auth.store";
import useListenToChannel from "@/hooks/useListenToChannel";
import { Message } from "@/api/services/chat/types";
import { useConversationStore } from "@/zustand-stores/conversation-store";
import { useParams } from "react-router-dom";

function ChatPage() {
  const curChatUserId = useChatStore((state) => state.curChatUserId);
  const { id } = useParams();
  const myId = useAuthStore((state) => state.user?.id);
  const addLastMessage = useChatStore((state) => state.addLastMessage);
  const addMessageToConversation = useConversationStore(
    (state) => state.addMessage
  );
  const onReceiveMessage = (message: Message) => {
    if (id) {
      
      addMessageToConversation(message);
    } else {
      addLastMessage(message.sender_id, message.message);
    }
  };

  useListenToChannel({
    userId: myId!,
    onReceiveMessage,
    otherUserId: curChatUserId || Number(id),
  });
  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar />
      {curChatUserId && <ChatArea />}
      {!curChatUserId && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Select a chat to start messaging</p>
        </div>
      )}
    </div>
  );
}

export default ChatPage;
