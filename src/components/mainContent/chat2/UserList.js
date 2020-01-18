import React from 'react';


function UserList({users, userData, handleClick}) {

    const returnValue = users ? 
    users && users.map((user, index) => {
        if(user.id !== userData.id) {
            return (
                <div className='userListItem' onClick={() => handleClick(user.id)} key={index}>
                    <p className='fullName'>{user.name}</p>
                    <p className='lastMessage'>Helt galen ka....</p>
                    <p className="timeStamp">{user.lastMessageAt}</p>
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
