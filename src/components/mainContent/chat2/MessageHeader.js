import React from 'react';

function MessageHeader({name}) {
  return (
    <div className='messageHeader'>
        <p>{name && 'Konversation'}</p>
    </div>
  )
}

export default MessageHeader;
