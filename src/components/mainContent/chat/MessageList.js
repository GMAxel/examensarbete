
import React from 'react';

function MessageList({messages, userData}) {
    if(!messages || !messages[0]) {
        return (
            <div className='messages'></div>
        );
    } 
    return (
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
    )
}

export default MessageList;
