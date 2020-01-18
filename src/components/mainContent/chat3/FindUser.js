import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext';

import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import { tokenUrl, instanceLocator } from './chat2/config';

const FindUsers = () => {
    const [joinableRooms, setJoinableRooms] = useState([]);
    const [joinedRooms, setJoinedRooms] = useState([]);
    const [user, setUser] = useState();
    const {userData} = useContext(AuthContext);

    useEffect(() => {
        const chatManager = new ChatManager({
            instanceLocator: instanceLocator,
            userId: userData.id,
            tokenProvider: new TokenProvider({ url: tokenUrl })
        })
        chatManager.connect()
        .then(currentUser => { 
            console.log(currentUser);
            setUser(currentUser);
            getRooms(currentUser);
        })
        .catch(err => {
            console.log('Error on connection', err)
        })
    }, [userData])

    const getRooms = (currentUser) => {
        currentUser.getJoinableRooms()
            .then(joinableRooms => {
                setJoinableRooms(joinableRooms);
                setJoinedRooms(currentUser.rooms);
            })
            .catch(err => console.log('error on joinableRooms: ', err));
    }
        
    const handleClick = (user) => {
        console.log(user)
    }

    const existingRooms = joinedRooms.map((room, index) => {
        {console.log('joinable rooms:', joinedRooms)}
        return (
            <div className='userListItem' onClick={() => handleClick(room)}key={index}>
                <p className='fullName'>{room.name}</p>
                <p className='lastMessage'>Helt galen ka....</p>
                <p className="timeStamp">10:00</p>
            </div>
        )
    });

    const nonExistingRooms = joinableRooms.map((room, index) => {
        return (
            <div className='userListItem' onClick={() => handleClick(room)}key={index}>
                <p className='fullName'>{room.name}</p>
                <p className='lastMessage'>Helt galen ka....</p>
                <p className="timeStamp">10:00</p>
            </div>
        )
    })


    return (
        <div className="mainContentStyle">
                <div className='userList'>
                    {existingRooms}
                    {nonExistingRooms}
                </div>
                
        </div>
    )
}

export default FindUsers;