import ChatItem from "./chat-item";
import { useChatStore } from "@/zustand-stores/chat-store";
import ChatNotifications from "./chat-notification";
import Loading from "@/components/my-ui/loading";

type ChatSidebarProps = {
  loadingInteractedUsers: boolean;
  handleSidebarToggle: () => void;
};

function ChatSidebar({
  loadingInteractedUsers,
  handleSidebarToggle,
}: ChatSidebarProps) {
  const interactedUsers = useChatStore((state) => state.interactedUsers);

  return (
    <aside
      dir="rtl"
      className="w-80 bg-white border-l border-gray-200 px-4 h-screen flex flex-col py-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">المحادثات</h2>
        <button
          className="text-gray-500 hover:text-gray-700 lg:hidden"
          onClick={handleSidebarToggle}
        >
          إغلاق
        </button>
      </div>
      <ChatNotifications />
      {/* <div className="relative mb-4">
        <input
          type="text"
          placeholder="ابحث" // Search
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 pr-10"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" />
      </div> */}
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
                handleSidebarToggle={handleSidebarToggle}
              />
            ))}
        </>
      </div>
    </aside>
  );
}

export default ChatSidebar;
