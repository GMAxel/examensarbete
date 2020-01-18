import React, {useReducer, useState} from 'react'
import Axios from 'axios';

const API_PATH = 'http://localhost/wies/examensarbete/examensarbete/api/queryHandler.php'

const SignUp = () => {
    const [userInput, setUserInput] = useReducer( 
        (state, newState) => ({...state, ...newState}),
            {
                firstName : '',
                lastName: '',
                username: '',
                password: '',
                description: ''
            }
    )
    const [errorMessage, setErrorMessage] = useState(null)
    const [success, setSucess] = useState(false);

    const handleChange = (e) => {
        const name = e.target.name;
        const newValue = e.target.value;
        setUserInput({[name]: newValue})
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        Axios.post(API_PATH + '/signup', {
            action: 'newUser',
            data: {
                firstName:  userInput.firstName,
                lastName:   userInput.lastName,
                username:   userInput.username,
                password:   userInput.password,
                description: userInput.description
            }
        })
        .then((response) => {
            console.log(response)
            // Rerouta användaren vid sucess.
            setErrorMessage(null)
            setSucess(true)
            setUserInput({
                firstName: '',
                lastName: '',
                username: '',
                password: '',
                description: ''
            })

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
                        <label>Description</label>
                        <textarea 
                            onChange={handleChange}
                            type="text"
                            name="description"
                            value={userInput.description}
                            className="createDescription"
                            maxlength="350"
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
                        <p>{success?'Konto Skapat - Logga in!':errorMessage}</p>
                    </li>            
                </ul>
            </form>
        </div>
    
    )
}

export default SignUp;