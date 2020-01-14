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
        
    
    )
}

export default SignUp;