import React, {useReducer} from 'react'
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

    const handleChange = (e) => {
        const name = e.target.name;
        const newValue = e.target.value;
        setUserInput({[name]: newValue})
    }
    /**
     * Använder post istället för get då det ska vara säkrare.
     * Get tenderar att lagra data i cache och liknande. 
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        Axios.post(API_PATH, {
            action: 'logIn',
            data: {
                username:   userInput.username,
                password:   userInput.password
            }
        })
        .then((response) => {
            console.log(response)
            // Rerouta användaren vid sucess.
        })
        .catch((error) => {
            console.log(error.response);
            // Visa felet för användaren.
        })
        .finally(function () {
            // always executed
        });
    }
    return (
        <div className="mainContentStyle">
            <form 
                className="createAccount"
                onSubmit={handleSubmit}
            >
                <h3>Sign In</h3>
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
                </ul>
            </form>
        </div>
    
    )
}

export default LogIn;