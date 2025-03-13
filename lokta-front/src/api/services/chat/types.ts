export type InteractedUser = {
  id: number;
  name: string;
  last_message_at: string | Date;
  last_messages: string[];
};

export type Message = {
  id: number;
  sender_id: number;
  receiver_id: number;
  created_at: string | Date;
  message: string;
};
