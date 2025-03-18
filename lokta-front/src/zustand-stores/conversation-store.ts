import { Message } from "@/api/services/chat/types";
import { create } from "zustand";

type ConversationState = {
  conversation: Message[];
  addMessage: (message: Message) => void;
  setConversation: (messages: Message[]) => void;
};

export const useConversationStore = create<ConversationState>()((set) => ({
  conversation: [],
  addMessage: (message: Message) =>
    set((state: ConversationState) => ({
      conversation: [...state.conversation, message],
    })),
  setConversation: (messages: Message[]) =>
    set(() => ({ conversation: messages })),
}));
