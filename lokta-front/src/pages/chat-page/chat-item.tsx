import { InteractedUser } from "@/api/services/chat/types";
import { formatTimestamp } from "@/lib/helpers";
import { useChatStore } from "@/zustand-stores/chat-store";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Props = InteractedUser;

function ChatItem({ last_message_at, id, name, last_messages }: Props) {
  const setCurChatUserId = useChatStore((state) => state.setCurChatUserId);
  const { id: curChatUserId } = useParams();
  const navigate = useNavigate();
  const handleClick = () => {
    setCurChatUserId(id);
    navigate("/chat/" + id);
  };

  useEffect(() => {
    if (curChatUserId) {
      setCurChatUserId(+curChatUserId);
    } else {
      setCurChatUserId(null);
    }
  }, [curChatUserId]);
  return (
    <div
      key={id}
      className="flex items-center py-4 px-2 rounded-md hover:bg-gray-100 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex flex-col justify-between w-[100%]">
        <div className="flex items-center justify-between w-[100%] ">
          <h3 className="text-sm text-gray-600 font-semibold">{name}</h3>
          <span>{formatTimestamp(last_message_at)}</span>
        </div>
        {last_messages.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-black font-bold">
              {last_messages[last_messages.length - 1]}
            </p>
            <span
              className="bg-[#194EB4] h-[18px] w-[18px]
            rounded-full flex items-center justify-center text-xs text-white"
            >
              {last_messages.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatItem;
