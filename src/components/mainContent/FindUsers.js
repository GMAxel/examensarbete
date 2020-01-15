import React, { useContext, useEffect, useState } from 'react'
import {ChatkitProvider, TokenProvider} from '@pusher/chatkit-client-react'
import { AuthContext } from '../../contexts/AuthContext'
import Axios from 'axios';


import { tokenUrl, instanceLocator } from './chat/config'
const tokenProvider = new TokenProvider({
    url: tokenUrl,
  });

  const API_PATH = 'http://localhost/wies/examensarbete/examensarbete/api/queryHandler.php'

const FindUsers = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        Axios.get(API_PATH + '/chat', {
            
        })
        .then((response) => {
            // x = response.data;
            setUsers(response.data.body)
        })
        .catch((error) => {
            console.log(error.response);
            // Visa felet för användaren.
        })
        .finally(function () {
            // always executed
        });
    })
        
    const handleClick = (user) => {
        console.log(user)
    }


    const {userData} = useContext(AuthContext);
    const userId = userData.id;
    const name  = userData.firstName + ' ' + userData.lastName;
    
    const otherUserId="bob";
    return (
        <div className="mainContentStyle">
                <div className='userList'>
                    {users.map((user, index) => {
                        return (
                            <div className='userListItem' onClick={() => handleClick(user)}key={index}>
                                <p className='fullName'>{user.name}</p>
                                <p className='lastMessage'>Helt galen ka....</p>
                                <p className="timeStamp">10:00</p>
                            </div>
                        )
                    })}
                </div>
                
        </div>
    )
}

export default FindUsers;