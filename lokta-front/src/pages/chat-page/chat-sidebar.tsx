import { Search } from "lucide-react";
import ChatItem from "./chat-item";
import { useChatStore } from "@/zustand-stores/chat-store";
import ChatNotifications from "./chat-notification";
import Loading from "@/components/my-ui/loading";

function ChatSidebar({
  loadingInteractedUsers,
}: {
  loadingInteractedUsers: boolean;
}) {
  const interactedUsers = useChatStore((state) => state.interactedUsers);

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
        <>
          {loadingInteractedUsers && (
            <div className="flex items-center justify-center">
              <Loading />
            </div>
          )}
          {!loadingInteractedUsers &&
            interactedUsers.map((item) => (
              <ChatItem
                key={item.id}
                name={item.name}
                last_messages={item.last_messages ?? []}
                last_message_at={item.last_message_at}
                id={item.id}
              />
            ))}
        </>
      </div>
    </aside>
  );
}

export default ChatSidebar;
