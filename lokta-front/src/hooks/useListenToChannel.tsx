import { useEffect, useRef } from "react";
import Pusher from "pusher-js";
import { Message } from "@/api/services/chat/types";
import env from "@/environment/env";

type Props = {
  userId: number;
  onReceiveMessage: (message: any) => void;
  otherUserId: number;
};

function useListenToChannel({ onReceiveMessage, userId, otherUserId }: Props) {
  const pusherRef = useRef<Pusher | null>(null);

  const initPusher = () => {
    console.log("✅ Connecting to Pusher... User:", userId);
    pusherRef.current = new Pusher(
      env.PUSHER_APP_KEY as string,
      {
        cluster: env.PUSHER_APP_CLUSTER as string,
        authEndpoint: "/pusher/auth",
        auth: { params: { userId } },
      }
    );
  };

  useEffect(() => {
    initPusher();
    if (!pusherRef.current) return;
    const channel = pusherRef.current.subscribe(
      `chat-private-channel-${userId}`
    );
    channel.bind("Private_chat", (data: { message: Message }) => {
      onReceiveMessage(data.message);
    });
    return () => {
      console.log("❌ Unsubscribing from channel...");
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [userId, otherUserId]);
}

export default useListenToChannel;
