import { Search, Phone, EllipsisVertical } from "lucide-react";
import profile from '../assets/profile.png'

interface ChatHeaderProps {
    id: number;
    name: string;

}

const ChatHeader = ({ id, name }: ChatHeaderProps) => {
    return (
        <div className="flex bg-white border-b border-gray-300">
            <div className="w-full p-4  flex items-center">
                <img src={profile} className="w-10 h-10 rounded-full mr-2" />
                <div>
                    <p className="font-semibold">{name} {id}</p>
                    <p className="text-sm text-gray-500">Last seen 5 mins ago</p>
                </div>
            </div>
            <div className="flex justify-between items-center mx-3">
                <button className=" hover:bg-gray-200 p-3">
                    <Search size={20} />

                </button>
                <button className=" hover:bg-gray-200 p-3">
                    <Phone size={20} />
                </button>

                <button className=" hover:bg-gray-200 p-3">
                    <EllipsisVertical size={20} />
                </button>
            </div>
        </div>
    )
}

export default ChatHeader