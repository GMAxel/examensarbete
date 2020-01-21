
import React from 'react';

function MessageList({messages, userData}) {
    if(!messages || !messages[0]) {
        return (
            <div className='messages'></div>
        );
    } 
    return (
        <div className='messages'>
            { messages.map((message, index) => {
                var author;
                if(message.senderId === userData.id) {
                    author = 'user'
                } else {
                    author = 'otherUser'
                }
                return (
                    <div 
                        className={author} 
                        key={index}
                    >   
                        <p>{message.parts[0].payload.content}</p>
                    </div>
                )
                }
            )}
        </div>
    )
}

export default MessageList;
