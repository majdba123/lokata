import chatBg from "@/assets/chat-bg.png";
import { useEffect, useState } from "react";
import { useChatStore } from "@/zustand-stores/chat-store";
import { toast } from "sonner";
import {
  getConversationApi,
  markMessagesAsReadApi,
  sendMessageApi,
} from "@/api/services/chat/chat-service";
import { useAuthStore } from "@/zustand-stores/auth.store";
import { useConversationStore } from "@/zustand-stores/conversation-store";
import { useParams } from "react-router-dom";
import ChatList from "./chat-list";
import ChatHeader from "./chat-header";
import { fixInvalidUserId } from "@/lib/helpers";
import ChatInput from "./chat-input";
import { getPossibleChatUserApi } from "@/api/services/user/user-service";
import { InteractedUser } from "@/api/services/chat/types";

function ChatArea() {
  const { id } = useParams();

  const myId = useAuthStore((s) => s.user?.id);
  const interactedUsers = useChatStore((state) => state.interactedUsers);
  const clearLastMessages = useChatStore((state) => state.clearLastMessages);
  const setCurChatUserId = useChatStore((state) => state.setCurChatUserId);
  const addInteractedUser = useChatStore((state) => state.addInteractedUser);
  const curUser = interactedUsers.find(
    (user) => user.id === fixInvalidUserId(id)
  );

  const [loadingChat, setLoadingChat] = useState(false);
  const conversation = useConversationStore((state) => state.conversation);
  const setConversation = useConversationStore(
    (state) => state.setConversation
  );
  const [newMessage, setNewMessage] = useState("");
  const [loadingSendMessage, setLoadingSendMessage] = useState(false);

  const fetchConversation = async () => {
    try {
      setLoadingChat(true);
      if (!Number.isNaN(fixInvalidUserId(id))) {
        const res = await getConversationApi(fixInvalidUserId(id));
        setConversation(res);
      }
      setLoadingChat(false);
      clearLastMessages(fixInvalidUserId(id));
    } catch (error: any) {
      toast.error(error.message);
      setLoadingChat(false);
    }
  };

  const handleSendMessage = async () => {
    try {
      setLoadingSendMessage(true);
      if (newMessage.trim() !== "") {
        await sendMessageApi(fixInvalidUserId(id), newMessage);
        setConversation([...conversation, mockNewMessage(newMessage)]);
        setNewMessage("");
      }
      setLoadingSendMessage(false);
    } catch (error: any) {
      toast.error(error.message);
      setLoadingSendMessage(false);
    }
  };

  const mockNewMessage = (newMessage: string) => {
    return {
      created_at: new Date(),
      id: Math.random(),
      message: newMessage,
      receiver_id: fixInvalidUserId(id),
      sender_id: myId!,
    };
  };

  const markMessagesAsRead = async () => {
    try {
      if (id) {
        await markMessagesAsReadApi(fixInvalidUserId(id));
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const fetchPossibleChatUser = async () => {
    const exists = interactedUsers.find(
      (user) => user.id === fixInvalidUserId(id)
    );
    if (exists) return;
    try {
      const res = await getPossibleChatUserApi(fixInvalidUserId(id));
      const possibleChatUser: InteractedUser = {
        id: res.id,
        name: res.name,
        last_message_at: new Date(),
        last_messages: [],
      };
      addInteractedUser(possibleChatUser);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (id) {
      setCurChatUserId(fixInvalidUserId(id));
    }
    markMessagesAsRead();
    fetchConversation();
    fetchPossibleChatUser();
    return () => {
      setConversation([]);
    };
  }, [id]);

  return (
    <main
      className="flex-1 flex flex-col"
      style={{ backgroundImage: `url(${chatBg})`, backgroundSize: "cover" }}
    >
      {curUser ? (
        <>
          <ChatHeader username={curUser?.name} />
          <ChatList loadingChat={loadingChat} conversation={conversation} />
          <ChatInput
            handleSendMessage={handleSendMessage}
            value={newMessage}
            setValue={setNewMessage}
            loadingSendMessage={loadingSendMessage}
          />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">User Not Found</p>
        </div>
      )}
    </main>
  );
}

export default ChatArea;
