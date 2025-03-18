import { Message } from "@/api/services/chat/types";
import { useEffect, useRef } from "react";
import ChatMessage from "./chat-messgae";

type Props = {
  conversation: Message[];
  loadingChat: boolean;
};

function ChatList({ conversation, loadingChat }: Props) {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  return (
    <>
      <div
        className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent"
        ref={chatContainerRef}
      >
        {loadingChat ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          conversation.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.message}
              created_at={message.created_at.toString()}
              id={message.id}
              sender_id={message.sender_id}
              receiver_id={message.receiver_id}
            />
          ))
        )}
      </div>
    </>
  );
}

export default ChatList;
