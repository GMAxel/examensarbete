import React, { useContext, useEffect, useState, useRef } from 'react'
import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import { tokenUrl, instanceLocator } from './config'
import { AuthContext } from '../../../contexts/AuthContext'
import UserList from './UserList'
import MessageList from './MessageList'
import ListHeader from './ListHeader'
import MessageHeader from './MessageHeader'
import NewMessage from './NewMessage'
import backBtn from './backBtn.png'

const Chat = (props) => {
    
    const [roomId, setRoomId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [rooms, setRooms] = useState([]);
    const {userData} = useContext(AuthContext);
    const userObj = useRef(null);

    useEffect(() => {
        const newRoom = props.location.search ? props.location.search.substr(1) :
            null;
        if (userData.isAuthenticated) {
            const chatManager = new ChatManager({
                instanceLocator: instanceLocator,
                userId: userData.id,
                tokenProvider: new TokenProvider({
                    url: tokenUrl
                })
            })
            chatManager.connect()
                .then(currentUser => {
                    console.log('nu subar vi på user')
                    userObj.current = currentUser;
                    setRooms(currentUser.rooms);
                    if (newRoom !== null) {
                        subscribeToRoom(newRoom);
                    }
                })          
                .catch(err => {
                    console.log('Error on connection', err)
                })
        }
        return ( () => {
            userObj.current && userObj.current.disconnect();
        })
    }, [])


    const subscribeToRoom = async (clicked_room_id = null) => {
        if(clicked_room_id === roomId) {
            return;
        }
        if(roomId !== null) {
            try {
                await userObj.current.roomSubscriptions[roomId].cancel();
                setRoomId(null);
            } catch (e) {
                console.log('error unsubbing to room', e);
            }
        }
        if (clicked_room_id !== null) {
            setMessages([]);
            await userObj.current.subscribeToRoomMultipart({
                roomId: clicked_room_id,
                messageLimit: 20, // default === 20
                hooks: {
                    onMessage: (message) => {
                        setMessages(prevMessages => {
                            return prevMessages.concat(message)
                        })
                    }
                }
            })
            .then(room => {
                setRoomId(room.id)
            })
            .catch(err => console.log('error on subscribing to room: ', err))
        } else {
            setMessages([]);    
            setRoomId(null)
            console.log(userObj.current.roomSubscriptions)
        } 
    }

    const backToChat = () => {
        subscribeToRoom()
    }

    const sendMessage = (text) => {
        userObj.current.sendMessage({
            text,
            roomId: roomId
        })
    }

    const inChatRoom = roomId ? 'inChatRoom'
    : 'notInChatRoom'
    return (
        <div className="mainContentStyle">
            {console.log(inChatRoom)}
            <div className={'chat ' + inChatRoom}>

                <button onClick={backToChat} className='chatBackBtn'>
                    <img alt="go back one step" src={backBtn}/>
                </button>
                
                <ListHeader />
                <UserList users={rooms} userData={userData} handleClick={subscribeToRoom}/>
                <MessageHeader />
                <MessageList messages={messages} userData={userData} />
                <NewMessage 
                    sendMessage={sendMessage}
                    disabled={!roomId}
                />
            </div>
        </div>
    )
}
export default Chat;