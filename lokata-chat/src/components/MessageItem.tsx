
import profile from '../assets/profile.png'
interface MessageItemProps {
    userId: number,
    userName: string,
    userState: string,
    handleOnSelectNewChat: (chat: { id: number, name: string }) => void
}
const MessageItem = ({ userId, handleOnSelectNewChat, userName,userState }: MessageItemProps) => {
    return (
        <div className="flex items-center p-2  cursor-pointer hover:bg-gray-100 "
            onClick={() => handleOnSelectNewChat({ id: userId, name: userName })}>
            <img src={profile} className="w-10 h-10 rounded-full mr-2" />
            <div>
                <p className="font-semibold">{userName}</p>
                <p className="text-sm text-gray-500">{userState}</p>
            </div>
        </div>
    )
}

export default MessageItem