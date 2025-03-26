import { Search } from "lucide-react";
import ChatItem from "./chat-item";
import { useEffect, useState } from "react";
import { useChatStore } from "@/zustand-stores/chat-store";
import { toast } from "sonner";
import { getInteractedUsersApi } from "@/api/services/chat/chat-service";
import ChatNotifications from "./chat-notification";
import { useParams } from "react-router-dom";
import { getPossibleChatUserApi } from "@/api/services/user/user-service";
import { fixInvalidUserId } from "@/lib/helpers";
import { InteractedUser } from "@/api/services/chat/types";

function ChatSidebar() {
  const setInteractedUsers = useChatStore((state) => state.setInteractedUsers);
  const interactedUsers = useChatStore((state) => state.interactedUsers);
  const addInteractedUser = useChatStore((state) => state.addInteractedUser);
  const [loadingInteractedUsers, setLoadingInteractedUsers] = useState(false);
  const { id } = useParams();

  const fetchNewInteractedUser = async (arr : InteractedUser[]) => {
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
        setLoadingInteractedUsers(false);
        toast.error(error.message);
      }
    };

    fetchInteractedUsers();

    return () => {
      setInteractedUsers([]);
    };
  }, []);

  console.log(interactedUsers)

  return (
    <aside className="w-80 bg-white border-r border-gray-200 px-4 h-screen flex flex-col py-5">
      <ChatNotifications />
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
        <Search className="absolute right-3 top-2.5 text-gray-400" />
      </div>
      <div className="space-y-2 overflow-y-auto flex-1">
        {loadingInteractedUsers ? (
          <p>Loading ...</p>
        ) : (
          <>
            {interactedUsers.map((item) => (
              <ChatItem
                key={item.id}
                name={item.name}
                last_messages={item.last_messages ?? []}
                last_message_at={item.last_message_at}
                id={item.id}
              />
            ))}
          </>
        )}
      </div>
    </aside>
  );
}

export default ChatSidebar;
