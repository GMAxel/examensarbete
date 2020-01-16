import React, { useContext, useEffect, useState } from 'react'
import {ChatkitProvider, TokenProvider} from '@pusher/chatkit-client-react'
import { AuthContext } from '../../../contexts/AuthContext'
import Axios from 'axios';

import './resources/App.css';
import MessageList from './MessageList';
import UserList from './UserList';

import { tokenUrl, instanceLocator } from './config'
const tokenProvider = new TokenProvider({
    url: tokenUrl,
  });

  const API_PATH = 'http://localhost/wies/examensarbete/examensarbete/api/queryHandler.php'

const Chat = () => {
    const [users, setUsers] = useState(null);
    const [secondUser, setSecondUser] = useState(null);
    const [messages, setMessages] = useState(null);
    const {userData} = useContext(AuthContext);

    useEffect(() => {
        console.log('useeffect körs')
        Axios.get(API_PATH + '/chat' , {
            
        })
        .then((response) => {
            setUsers(response.data.body)
            console.log(response)
        })
        .catch((error) => {
            console.log(error.response);
            // Visa felet för användaren.
        })
        .finally(function () {
            // always executed
        });
    }, []);
    useEffect(() => {
        if(secondUser !== null) {
            Axios.post(API_PATH + '/chat' + '/' + secondUser.id, {
                user: {
                    id: userData.id,
                    name: userData.firstName + ' ' + userData.lastName

                },
                secondUser : {
                    id: secondUser.id,
                    name: secondUser.name
                }
            })
            .then((response) => {
                console.log(response)
                setMessages(response.data.body)
            })
            .catch((error) => {
                console.log(error.response);
                // Visa felet för användaren.
            })
            .finally(function () {
                // always executed
            });
        }
    }, [secondUser]);
        
    const handleClick = (user) => {
        console.log(user)
        setSecondUser(user);
    }
    const activeChat = secondUser ? secondUser : '';
    return (
        <div className="mainContentStyle">
            
            <div className='chat'>
                <div className='listHeader'>
                    <p>Meddelanden</p>
                </div>
                <div className='userList'>
                    {users && users.map((user, index) => {
                        if(user.id !== userData.id) {
                            return (
                                <div className='userListItem' onClick={() => handleClick(user)}key={index}>
                                    <p className='fullName'>{user.name}</p>
                                    <p className='lastMessage'>Helt galen ka....</p>
                                    <p className="timeStamp">10:00</p>
                                </div>
                            )
                        }
                    })}
                </div>
                <div className='messageHeader'>
                    <p>{activeChat.name}</p>
                </div>
                <div className='messages'>
                    {messages && messages.map((message, index) => {
                        var author;
                        if(message.user_id === userData.id) {
                            author = 'user'
                        } else {
                            author = 'otherUser'
                        }
                        return (
                            <div 
                                className={author} 
                                key={index}
                            >

                                <p>{message.parts[0].content}</p>
                            </div>
                        )
                    }
                    )}
                </div>
                <div className='newMessage'>
                    <input 
                        type="text"
                        placeholder="Skriv ett meddelande..."
                    />
                    <button>Skicka</button>
                </div>
            </div>
        </div>
    )
}

export default Chat;