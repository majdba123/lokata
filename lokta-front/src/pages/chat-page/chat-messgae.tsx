import { cn } from "@/lib/utils";
import { useAuthStore } from "@/zustand-stores/auth.store";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { formatTimestamp } from "@/lib/helpers";
dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isSameOrBefore);

type Props = {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  created_at: string;
};
function ChatMessage({ id, sender_id, message, created_at }: Props) {
  const userId = useAuthStore((state) => state.user?.id);

  return (
    <div
      key={id}
      className={cn("flex", {
        "justify-end": userId === sender_id,
        "justify-start": userId !== sender_id,
      })}
    >
      <div
        className={cn("p-2 rounded-lg max-w-xs", {
          "bg-blue-500 text-white": userId === sender_id,
          "bg-gray-200": userId !== sender_id,
          "rounded-br-none": userId === sender_id,
          "rounded-bl-none": userId !== sender_id,
        })}
      >
        {message}
        <div className="flex items-center justify-end text-sm mt-1" dir="ltr">
          
          {formatTimestamp(created_at)}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
