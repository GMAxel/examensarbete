import React, { useContext, useEffect, useState } from 'react'
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

    // let user;
    const [user, setUser] = useState(null);
    useEffect(() => {
        let c_user;
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
                    c_user = currentUser;
                    setUser(currentUser);
                    setRooms(currentUser.rooms);
                    if (newRoom !== null) {
                        setRoomId(newRoom);
                    }

                })
                .catch(err => {
                    console.log('Error on connection', err)
                })
        }
        return ( () => {
            console.log(c_user);
            console.log('nu unsubar vi på user')
            c_user && c_user.disconnect();
        })
    }, [userData])

    useEffect(() => {
        console.log('rumsid:', roomId);
        console.log('user:', user);

        if (roomId !== null) {
            setMessages([]);
            console.log('subscribe to room')
            user.subscribeToRoom({
                    roomId: roomId,
                    messageLimit: 20, // default === 20
                    hooks: {
                        onMessage: (message) => {
                            if(message.roomId !== roomId) {
                                console.log(roomId);
                                return false;
                            }
                            setMessages(prevMessages => {
                                return prevMessages.concat(message)
                            })
                        }
                    }
                })
                .catch(err => console.log('error on subscribing to room: ', err))
        }
        return ( () => {
            user && user.roomSubscriptions[roomId].cancel()
        })
    }, [roomId])

    const handleClick = (roomId) => {
        console.log(roomId);
        setRoomId(roomId)
    }

    // const backToChat = () => {
    //     setRoomId(null)
    //     setMessages([]);
    //     // props.history.push('/chat');

    // }

    const sendMessage = (text) => {
        user.sendMessage({
            text,
            roomId: roomId
        })
    }

    const inChatRoom = roomId ? 'inChatRoom'
    : 'notInChatRoom'

    return (
        <div className="mainContentStyle">
            <div className={'chat ' + inChatRoom}>

                <button onClick={() => console.log('hej')} className='chatBackBtn'>
                    <img src={backBtn}/>
                </button>
                
                <ListHeader />
                <UserList users={rooms} userData={userData} handleClick={handleClick}/>
                <MessageHeader name={roomId}/>
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