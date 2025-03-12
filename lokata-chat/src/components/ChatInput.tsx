import { Smile, SendHorizonal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { MessageInterface } from "../types/MessageInterface";

interface ChatInputProps {
  handleSub: (chat: MessageInterface) => void;
  receiver_id: number;
  sender_id: number
}


const ChatInput = ({ handleSub, receiver_id ,sender_id}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Handle emoji selection
  const handleEmojiClick = (emoji: EmojiClickData) => {
    setMessage((prev) => prev + emoji.emoji);
  };

  // Auto-resize textarea up to 3 lines
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 3 * 24; // Approx height of 3 lines (24px per line)
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      textareaRef.current.style.overflowY = scrollHeight > maxHeight ? "scroll" : "hidden";
    }
  }, [message]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    }

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const now = new Date();
      handleSub({ created_at: now.toString(), message, receiver_id, sender_id })
      console.log("Message sent:", message);
      setMessage(""); // Clear input after sending
    }
  };

  return (
    <div className="relative w-full p-4">
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-[calc(100%+10px)] left-4 z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="w-full bg-white rounded-lg flex items-center py-2 px-4 shadow-md">
        {/* Emoji Button */}
        <button
          type="button"
          className="cursor-pointer text-blue-500"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          <Smile />
        </button>

        {/* Textarea (Auto Expanding Input) */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          className="flex-1 p-2 mx-2 w-full max-h-[72px] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={1} // Start with 1 line
        />

        {/* Send Button */}
        <button type="submit" className="cursor-pointer text-blue-600">
          <SendHorizonal color="#194EB4" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
