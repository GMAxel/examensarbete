import React, { useContext, useEffect } from 'react'
import {ChatkitProvider, TokenProvider} from '@pusher/chatkit-client-react'
import { AuthContext } from '../../../contexts/AuthContext'

import './resources/App.css';
import MessageList from './MessageList';
import UserList from './UserList';

import { tokenUrl, instanceLocator } from './config'
const tokenProvider = new TokenProvider({
    url: tokenUrl,
  });

const Chat = () => {
    const {userData} = useContext(AuthContext);
    let userId = userData.id;

    userId = 'alice';
    const otherUserId="bob";
    return (
        <div className="mainContentStyle">
            <div className="Chat">
            {userId && otherUserId ? (
                <>
                <div className="App__chatwindow">
                    <ChatkitProvider
                    instanceLocator={instanceLocator}
                    tokenProvider={tokenProvider}
                    userId={userId}
                    >
                    <UserList userId={userId}/>
                    <MessageList otherUserId={otherUserId} />
                    </ChatkitProvider>
                </div>
                </>
            ) : (
                null
            )}
            
            </div>
        </div>
    )
}

export default Chat;