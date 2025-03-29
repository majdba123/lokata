import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  username: string;
};
function ChatHeader({ username }: Props) {
  const navigate = useNavigate();
  const backHome = () => {
    navigate("/");
  };
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-white">
      <div className="flex items-center">
        <div>
          <h3 className="text-sm font-semibold">{username}</h3>
        </div>
      </div>
      <div>
        <Button onClick={backHome} variant="ghost" size="icon">
          <ArrowLeft />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="text-gray-500" />
        </Button>
      </div>
    </div>
  );
}

export default ChatHeader;
