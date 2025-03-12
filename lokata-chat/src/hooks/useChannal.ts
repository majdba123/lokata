import { useEffect, useState, useRef } from "react";
import Pusher from "pusher-js";

const usePusher = (userId: number) => {
  const [messages, setMessages] = useState<any[]>([]);
  const pusherRef = useRef<Pusher | null>(null);

  useEffect(() => {
    if (userId === -1) return;

    console.log("✅ Connecting to Pusher... User:", userId);

    // If a Pusher instance already exists, don't create a new one
    if (!pusherRef.current) {
      pusherRef.current = new Pusher("10d216ea57c8cc5c5030", {
        cluster: "eu",
        authEndpoint: "/pusher/auth",
        auth: { params: { userId } },
      });
    }

    const channel = pusherRef.current.subscribe(`chat-private-channel-${userId}`);

    channel.bind("Private_chat", (data: any) => {
      console.log("📩 Received message:", data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      console.log("❌ Unsubscribing from channel...");
      channel.unbind_all();
      channel.unsubscribe();
      // Do NOT disconnect Pusher globally, as it might be used elsewhere
    };
  }, [userId]); // Only re-run when userId changes

  return messages;
};

export default usePusher;
