import React from 'react';


function UserList({users, userData, handleClick}) {

    const returnValue = users ? 
    users && users.map((user, index) => {
        if(user.id !== userData.id) {
            return (
                <div className='userListItem' onClick={() => handleClick(user)} key={index}>
                    <p className='fullName'>{user.name}</p>
                    <p className='lastMessage'>Helt galen ka....</p>
                    <p className="timeStamp">10:00</p>
                </div>
            )
        }
    }) : 
    null;
    return (
    <div className='userList'>
        {returnValue}
    </div>
    )
}

export default UserList;
