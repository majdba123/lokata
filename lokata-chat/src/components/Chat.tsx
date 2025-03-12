
import { useEffect, useRef } from 'react'
import profile from '../assets/profile.png'
import { MessageInterface } from '../types/MessageInterface'
interface chatProps {
    messages: MessageInterface[];
    currentUser: number;
}

const Chat = ({ messages, currentUser }: chatProps) => {
    const chatContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]); // Scroll down when messages update
    return (
        <div className="flex-1 p-4 overflow-y-auto " ref={chatContainerRef}>
            <div className="text-center text-sm text-gray-500 mb-4">Today</div>
            {
                (messages && Array.isArray(messages)) ? messages?.map((mess) => (
                    <div  className={`chat ${mess.sender_id == currentUser ? "chat-end" : "chat-start"}`}>

                        <div className='chat-image avatar'>
                            <div className='size-10' >
                                <img src={profile} className="w-8 h-8 rounded-full mr-2" />
                            </div>

                        </div>
                        <div className='chat-header mb-1'>
                            <time className='text-xs opacity-90 ml-1'>{mess.created_at}</time>
                        </div>
                        <div className='chat-bubble flex'>
                            {mess.message}
                        </div>
                    </div>
                )) : <h1>loading</h1>

            }
        </div>
    )
}

export default Chat