import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../contexts/AuthContext'
import Axios from 'axios';
import './resources/App.css';
import MessageList from './MessageList';
import UserList from './UserList';
import MessageHeader from './MessageHeader';
import NewMessage from './NewMessage';
import ListHeader from './ListHeader';

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
        }
    }, [secondUser]);
    
    const sendMessage = (message) =>  {
        console.log(message);
    }
        
    const handleClick = (user) => {
        console.log(user)
        setSecondUser(user);
    }
    const activeChat = secondUser ? secondUser.name : '';
    return (
        <div className="mainContentStyle">
            <div className='chat'>
                <ListHeader />
                <UserList users={users} userData={userData} handleClick={handleClick} />
                <MessageHeader name={activeChat}/>
                <MessageList messages={messages} userData={userData} />
                <NewMessage sendMessage={sendMessage}/>
            </div>
        </div>
    )
}
export default Chat;