import React from 'react';


function UserList({users, userData, handleClick}) {
    const fullName = userData.firstName + ' ' + userData.lastName;
    const returnValue = users ? 
    users && users.map((user, index) => {
        if(user.id !== userData.id) {
            let secondUser = user.name.split(fullName);
            let lastMessageTime = user.lastMessageAt?  
                user.lastMessageAt.split('T')[1].split('Z')[0].split(':'):
                null;
            return (
                <div className='userListItem' onClick={() => handleClick(user.id)} key={index}>
                    <p className='fullName'>{secondUser}</p>
                    <p className="timeStamp">{lastMessageTime && lastMessageTime[0] + ':' + lastMessageTime[1]}</p>
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