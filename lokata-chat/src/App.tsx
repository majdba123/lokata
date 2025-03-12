
import chatBG from './assets/bgprint.png'
import './App.css'
import SearchBar from './components/SearchBar'
import MessageItem from './components/MessageItem'
import ChatHeader from './components/ChatHeader'
import Chat from './components/Chat'
import ChatInput from './components/ChatInput'
import { useEffect, useState } from 'react'
import { MessageInterface } from './types/MessageInterface'
import Login from './components/Login'
import { getToken, getUser, isAuthenticated, logout } from './Api/User'
import api from './Api/Api'

import ChatListItem from './types/ChatListItem'
import Pusher from 'pusher-js';
import usePusher from './hooks/useChannal'
import Mytemp from './components/mytemp'



function App() {
  /**
   * POST   /api/SendTo/{recive_id} 
   * GET    /api/messages-from-sender/{sender_id}
   *        /api/mark-messages-as-read/{sender_id}'
   *        /api/unread-messages
   */




  const [isLogin, setLogin] = useState(false)
  const [messages, setMessage] = useState<MessageInterface[]>([]); // ✅ Default to []
  const [ChatList, setChatList] = useState<ChatListItem[]>([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [curUser, setCurUser] = useState(-1)
  const channalMessage = usePusher(curUser)
  useEffect(() => {


    const fetchData = async () => {
      console.log(`ENTER fetchData`)
      try {
        const data = await getChatList();
        const chatlist = data.data as ChatListItem[];
        console.log("Fetched Data:", chatlist);
        const myUser = getUser();
        setCurUser(myUser)
        setChatList(chatlist)
      } catch (error) {

        console.log('not auth', error)
        if (!error.response) {
          console.log(error)
          return;
        }
        if (error.response.status == 401) {
          console.log('not auth do work')
          logout();
          setLogin(false)
          setCurUser(-1)
        }
      }

    };

    fetchData(); // **Call the async function**


  }, [isLogin]);

  useEffect(() => {
    const token = getToken() // Load token from storage
    if (token) {
      setLogin(true); // Update state if token exists
    } else {
      setLogin(false);
    }
  }, []);

  const handleSelectChat = async (chat: { id: number, name: string }) => {

    const res = await getChat(chat.id);
    console.log('handle chat selected', res)
    setMessage(res)
    setSelectedChat(chat)
  }

  const handleInsertNewMessage = async (newmessage: MessageInterface) => {
    const res = await sendMessageToCertainUser(newmessage.message, selectedChat?.id)

    setMessage((prv) => Array.isArray(prv) ? [...prv, newmessage] : [newmessage])
  }


  const handleIsLogin = (islogin: boolean) => {
    setLogin(islogin)
  }

  return (
    <>
    {/* <Mytemp /> */}
      {isLogin ?
        <div className='bg-gray-100 h-screen flex'>

          <div className="w-1/4 bg-white border-r border-gray-200 py-2 flex flex-col ">

            <SearchBar />

            <div className="overflow-y-auto flex-grow">
              {ChatList.map((user, index) => (
                <div key={index}>

                  <MessageItem userId={user.id}
                    userName={user.name}
                    userState={`my state ${user.id}`}
                    handleOnSelectNewChat={handleSelectChat} />

                </div>
              ))}
            </div>
          </div>

          {selectedChat && <div className="flex-1 flex flex-col"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.59), rgba(0,0,0,0.59)), url(${chatBG})`,
              backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'
            }}>

            <ChatHeader id={selectedChat?.id} name={selectedChat?.name} />
            {(curUser && curUser !== undefined) && <Chat messages={messages} currentUser={curUser} />}
            <ChatInput handleSub={handleInsertNewMessage} sender_id={curUser} receiver_id={selectedChat?.id} />

          </div>}

        </div> : <Login handleIslLogin={handleIsLogin} />}

    </>
  )
}

export default App





const getChat = async (selectedChatId: number) => {
  const token = getToken();

  console.log('calling get chat')
  if (!token) return;
  console.log('calling get chat - selected user', selectedChatId)
  console.log(`calling get chat - api call /getConversation/${selectedChatId}`)
  console.log(`calling get chat - api call with token ${token}`)
  const res = await api.get(`/getConversation/${selectedChatId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Attach JWT to request
    },
  })
  return res.data;
}

const getChatList = async () => {
  const token = getToken();


  if (!token) return;

  console.log(`getChatList toke ${token}`)
  const res = await api.get(`/getInteractedUsers`, {
    headers: {
      Authorization: `Bearer ${token}`, // Attach JWT to request
    },
  })

  return res.data;
}

const sendMessageToCertainUser = async (message: string, id: number) => {
  const token = getToken();
  if (!token) return;
  try {
    const data = { message }
    const res = await api.post(`/SendTo/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach JWT to request
      },
    })
    return res;
  } catch (error) {
    console.log(error)
  }

}