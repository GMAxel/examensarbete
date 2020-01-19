import React, {useReducer, useContext, useState} from 'react'
import { AuthContext } from '../../contexts/AuthContext';
import Axios from 'axios';
const API_PATH = 'http://localhost/wies/examensarbete/examensarbete/api/queryHandler.php'

const LogIn = () => {
    const [userInput, setUserInput] = useReducer( 
        (state, newState) => ({...state, ...newState}),
            {
                username: '',
                password: ''
            }
    )
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const handleChange = (e) => {
        const name = e.target.name;
        const newValue = e.target.value;
        setUserInput({[name]: newValue})
    }
    /**
     * Använder post istället för get då det ska vara säkrare.
     * Get tenderar att lagra data i cache och liknande. 
     */
    const {onLogIn, userData} = useContext(AuthContext);
    const handleSubmit = (e) => {
        e.preventDefault();
        Axios.post(API_PATH + '/login', {
            action: 'logIn',
            data: {
                username:   userInput.username,
                password:   userInput.password
            }
        })
        .then((response) => {
            onLogIn(response.data);
        })
        .catch((error) => {
            console.log(error.response);
            setSuccess(false);
            setError(error.response.data);
            // Visa felet för användaren.
        })
        .finally(function () {
            // always executed
        });
    }
    const data = userData.isAuthenticated ? userData.username : null;
    return (
        <div className="mainContentStyle">
            <form 
                className="createAccount"
                onSubmit={handleSubmit}
            >
                <h3>Sign In </h3>
                {data}
                <ul>
                    <li>
                        <label>Username</label>
                        <input 
                            onChange={handleChange}
                            type="text"
                            name="username"
                            value={userInput.username}
                            required
                        />
                    </li>
                    <li>
                        <label>Password</label>
                        <input 
                            onChange={handleChange}
                            type="password"
                            name="password"
                            value={userInput.password}
                            required
                        />  
                    </li>
                    <li>
                        <button>
                            Sign In
                        </button>
                    </li>            
                    <li>
                        <p>{success?'':error}</p>
                    </li>   
                </ul>
            </form>
        </div>
    
    )
}

export default LogIn;