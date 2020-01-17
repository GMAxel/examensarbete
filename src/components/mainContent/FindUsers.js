import React, { useEffect, useState } from 'react'
import Axios from 'axios';

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