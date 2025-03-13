import { useAuthStore } from "@/zustand-stores/auth.store";
import { resolveError } from "../helpers/error-resolver";
import axios from "axios";
import { API_URL } from "@/api/constants";
import { InteractedUser, Message } from "./types";

class ChatService {
  getInteractedUsersApi = async () => {
    try {
      const token = useAuthStore.getState().accessToken;
      const { data } = await axios.get<InteractedUser[]>(
        API_URL + "/api/getInteractedUsers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };

  getConversationApi = async (userId: number) => {
    try {
      const token = useAuthStore.getState().accessToken;
      const { data } = await axios.get<Message[]>(
        API_URL + "/api/getConversation/" + userId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (Array.isArray(data)) return data;
      return [];
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };

  sendMessageApi = async (userId: number, message: string) => {
    try {
      const token = useAuthStore.getState().accessToken;
      await axios.post(
        API_URL + "/api/SendTo/" + userId,
        {
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };

  markMessagesAsReadApi = async (userId: number) => {
    try {
      const token = useAuthStore.getState().accessToken;
      await axios.post(
        API_URL + "/api/mark-messages-as-read/" + userId,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };
}

export const {
  getInteractedUsersApi,
  getConversationApi,
  sendMessageApi,
  markMessagesAsReadApi,
} = new ChatService();
