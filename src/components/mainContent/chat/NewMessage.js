
import React, {useState} from 'react';

function NewMessage({sendMessage, disabled}) {

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setMessage(e.target.value);
    }
    const handleClick = (e) => {
        e.preventDefault();
        sendMessage(message);
        setMessage('');
    }
    return (
    <div className='newMessage'>
        <form>
        <input 
            type="text"
            placeholder="Skriv ett meddelande..."
            value={message}
            onChange={handleChange}
            disabled={disabled}
        />
        <button disabled={disabled} onClick={handleClick}>
            Skicka
        </button>
        </form>
    </div>
    )
}

export default NewMessage;
