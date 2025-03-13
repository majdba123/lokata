import { InteractedUser } from "@/api/services/chat/types";
import { create } from "zustand";

type ChatState = {
  curChatUserId: null | number;
  setCurChatUserId: (id: number | null) => void;
  interactedUsers: InteractedUser[];
  setInteractedUsers: (users: InteractedUser[]) => void;
  addInteractedUser: (user: InteractedUser) => void;
  addLastMessage: (userId: number, message: string) => void;
  clearLastMessages: (userId: number) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  curChatUserId: null,
  setCurChatUserId: (id: number | null) => set(() => ({ curChatUserId: id })),
  interactedUsers: [],
  setInteractedUsers: (users: InteractedUser[]) =>
    set(() => ({ interactedUsers: users })),
  addInteractedUser: (user: InteractedUser) =>
    set((state: ChatState) => ({
      interactedUsers: [...state.interactedUsers, user],
    })),
  addLastMessage: (userId: number, message: string) =>
    set((state: ChatState) => {
      const updatedUsers = state.interactedUsers.map((user) =>
        user.id === userId
          ? { ...user, last_messages: [...(user.last_messages ?? []), message] }
          : user
      );

      return { interactedUsers: updatedUsers };
    }),
  clearLastMessages: (userId: number) =>
    set((state: ChatState) => {
      const updatedUsers = state.interactedUsers.map((user) =>
        user.id === userId ? { ...user, last_messages: [] } : user
      );
      return { interactedUsers: updatedUsers };
    }),
}));
