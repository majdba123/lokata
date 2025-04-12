import ChatSidebar from "./chat-sidebar";
import ChatArea from "./chat-area";
import { useChatStore } from "@/zustand-stores/chat-store";
import { useAuthStore } from "@/zustand-stores/auth.store";
import useListenToChannel from "@/hooks/useListenToChannel";
import { InteractedUser, Message } from "@/api/services/chat/types";
import { useConversationStore } from "@/zustand-stores/conversation-store";
import { useParams } from "react-router-dom";
import { fixInvalidUserId } from "@/lib/helpers";
import { getPossibleChatUserApi } from "@/api/services/user/user-service";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getInteractedUsersApi } from "@/api/services/chat/chat-service";

function ChatPage() {
  const setInteractedUsers = useChatStore((state) => state.setInteractedUsers);
  const interactedUsers = useChatStore((state) => state.interactedUsers);
  const addInteractedUser = useChatStore((state) => state.addInteractedUser);
  const [loadingInteractedUsers, setLoadingInteractedUsers] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const fetchNewInteractedUser = async (arr: InteractedUser[]) => {
    try {
      if (!id || id == "-1") return;
      const res = await getPossibleChatUserApi(fixInvalidUserId(id));
      setInteractedUsers(arr.filter((user) => user.id !== res.id));
      const newInteractedUser = {
        ...res,
        last_messages: [],
        last_message_at: new Date(),
      };
      addInteractedUser(newInteractedUser);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchInteractedUsers = async () => {
      try {
        setLoadingInteractedUsers(true);
        const res = await getInteractedUsersApi();
        setInteractedUsers(res);
        await fetchNewInteractedUser(res);
        setLoadingInteractedUsers(false);
      } catch (error: any) {
        toast.error(error.message);
        setLoadingInteractedUsers(false);
      }
    };

    fetchInteractedUsers();
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div dir="rtl" className="flex h-screen bg-gray-100 relative">
      {/* Mobile Menu Button - Only visible on small screens */}
      {!isSidebarOpen && (
        <button
          className="lg:hidden fixed top-4 right-4 z-20 p-2 rounded-md bg-white shadow-md"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      )}

      {/* Sidebar with responsive classes */}
      <div
        className={`
      ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
      lg:translate-x-0
      fixed lg:relative
      top-0 right-0
      h-full
      z-10
      transition-transform duration-300 ease-in-out
      lg:block
      `}
      >
        <ChatSidebar
          handleSidebarToggle={handleSidebarToggle}
          loadingInteractedUsers={loadingInteractedUsers}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {id && <ChatArea />}
        {!id && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">حدد محادثة لبدء المراسلة</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
