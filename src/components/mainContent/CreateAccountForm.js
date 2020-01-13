import React, {useReducer, useState} from 'react'
import Axios from 'axios';

const API_PATH = 'http://localhost/wies/examensarbete/examensarbete/api/queryHandler.php'

const CreateAccountForm = () => {
    const [userInput, setUserInput] = useReducer( 
        (state, newState) => ({...state, ...newState}),
            {
                firstName : '',
                lastName: '',
                username: '',
                password: ''
            }
    )
    const [errorMessage, setErrorMessage] = useState(null)

    const handleChange = (e) => {
        const name = e.target.name;
        const newValue = e.target.value;
        setUserInput({[name]: newValue})
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        Axios.post(API_PATH, {
            action: 'newUser',
            data: {
                firstName:  userInput.firstName,
                lastName:   userInput.lastName,
                username:   userInput.username,
                password:   userInput.password
            }
        })
        .then((response) => {
            console.log(response)
            // Rerouta användaren vid sucess.
            setErrorMessage(null)
        })
        .catch((error) => {
            console.log('Error!: ', error.response);
            setErrorMessage(error.response.data)
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
                <h3>Sign up</h3>
                <ul>
                    <li>
                        <label>First Name</label>
                        <input 
                            onChange={handleChange}
                            type="text"
                            name="firstName"
                            value={userInput.firstName}
                            required
                        />
                    </li>
                    <li>
                        <label>Last Name</label>
                        <input 
                            onChange={handleChange}
                            type="text"
                            name="lastName"
                            value={userInput.lastName}
                            required
                        />                
                    </li>
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
                            Create Account!
                        </button>
                    </li>     
                    <li>
                        <p>{errorMessage}</p>
                    </li>            
                </ul>
            </form>
        </div>
    
    )
}

export default CreateAccountForm;