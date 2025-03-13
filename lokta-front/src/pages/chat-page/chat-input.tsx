import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";

type Props = {
  value: string;
  setValue: (value: string) => void;
  loadingSendMessage: boolean;
  handleSendMessage: () => void;
};

function ChatInput(props: Props) {
  return (
    <div className="p-4">
      <div className="relative">
        <input
          onChange={(e) => props.setValue(e.target.value)}
          value={props.value}
          type="text"
          placeholder="Message"
          className="outline-none w-full px-12 py-3 border rounded-full bg-white focus:outline-none focus:ring focus:border-blue-300 pr-12"
          disabled={props.loadingSendMessage}
        />
        <Button
          variant="outline"
          className="absolute right-3 top-1.5 rounded-full p-2 border-0 cursor-pointer"
          onClick={props.handleSendMessage}
          disabled={props.loadingSendMessage}
        >
          <SendHorizonal className="h-4 w-4 text-blue-600" />
        </Button>
      </div>
    </div>
  );
}

export default ChatInput;
