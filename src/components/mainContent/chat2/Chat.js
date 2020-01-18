import React, { useContext, useEffect, useState } from 'react'
import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import { tokenUrl, instanceLocator } from './config'
import { AuthContext } from '../../../contexts/AuthContext'
import UserList from './UserList'
import MessageList from './MessageList'
import ListHeader from './ListHeader'
import MessageHeader from './MessageHeader'
import NewMessage from './NewMessage'

const Chat = (props) => {
    
    const [roomId, setRoomId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [user, setUser] = useState();
    console.log(props)

    const {userData} = useContext(AuthContext);
      

    useEffect(() => {
        const newRoom = props.location.search ? props.location.search.substr(1)
        : null;
        console.log(newRoom);
        if(userData.isAuthenticated)  {
            
        
            const chatManager = new ChatManager({
                instanceLocator: instanceLocator,
                userId: userData.id,
                tokenProvider: new TokenProvider({ url: tokenUrl })
            })
            chatManager.connect()
            .then(currentUser => { 
                setUser(currentUser);
                console.log(currentUser.rooms);
                setRooms(currentUser.rooms);
                console.log(currentUser.rooms);

            })
            .catch(err => {
                console.log('Error on connection', err)
            })
        }
    }, [userData])

    const subscribeToRoom = (roomId) => {
        setMessages([]);
        user.subscribeToRoom({
            roomId: roomId,
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
            console.log(room);
            setRoomId(room.id)
        })
        .catch(err => console.log('error on subscribing to room: ', err))
    }
    const sendMessage = (text) => {
        user.sendMessage({
            text,
            roomId: roomId
        })
    }
    const createRoom = (id) => {
        user.createRoom({
            private: true,
            addUserIds: [id]
        })
        .then(room => user.subscribeToRoom(room.id))
        .catch(err => console.log('error with createRoom: ', err))
    }

    return (
        <div className="mainContentStyle">
            <div className='chat'>
                <ListHeader />
                <UserList users={rooms} userData={userData} handleClick={subscribeToRoom}/>
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