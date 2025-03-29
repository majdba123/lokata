import ChatSidebar from "./chat-sidebar";
import ChatArea from "./chat-area";
import { useChatStore } from "@/zustand-stores/chat-store";
import { useAuthStore } from "@/zustand-stores/auth.store";
import useListenToChannel from "@/hooks/useListenToChannel";
import { Message } from "@/api/services/chat/types";
import { useConversationStore } from "@/zustand-stores/conversation-store";
import { useParams } from "react-router-dom";
import { fixInvalidUserId } from "@/lib/helpers";

function ChatPage() {
  const interactedUsers = useChatStore((state) => state.interactedUsers);
  const increaseNewMessagesCounter = useChatStore(
    (state) => state.increaseNewMessagesCounter
  );

  const { id } = useParams();
  const myId = useAuthStore((state) => state.user?.id);
  const addLastMessage = useChatStore((state) => state.addLastMessage);
  const addMessageToConversation = useConversationStore(
    (state) => state.addMessage
  );
  const onReceiveMessage = (message: Message) => {
    const sender_id = message.sender_id;
    const existInInteractedUsers = interactedUsers.find(
      (user) => user.id == sender_id
    );
    if (!existInInteractedUsers) {
      increaseNewMessagesCounter();
      return;
    }
    if (id && sender_id == fixInvalidUserId(id)) {
      addMessageToConversation(message);
    } else {
      addLastMessage(message.sender_id, message.message);
    }
  };

  useListenToChannel({
    userId: myId!,
    onReceiveMessage,
    otherUserId: fixInvalidUserId(id),
  });
  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar />
      {id && <ChatArea />}
      {!id && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Select a chat to start messaging</p>
        </div>
      )}
    </div>
  );
}

export default ChatPage;
