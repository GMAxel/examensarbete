import React, { useContext, useReducer, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Axios from 'axios';
const API_PATH = 'http://localhost/wies/examensarbete/examensarbete/api/queryHandler.php'

const reducer = (currentState, action) => {
    console.log(currentState, action);
    return {...currentState, ...action}
    // return {...currentState, }
}
const MyAccount = () => {
    const {userData, onLogIn, onLogOut} = useContext(AuthContext);
    const [userInput, dispatch] = useReducer(
        (currentState, newValue) => ({...currentState, ...newValue}), 
        {
            firstName: userData.firstName ,
            lastName : userData.lastName,
            username : userData.username,
            description : userData.description || 'Ej satt',
            password: ''
        });
    const [errorMessage, setErrorMessage] = useState();
    const [success, setSuccess] = useState(null);

    
    const handleChange = (e) => {
        console.log(e.target.value)
        dispatch({[e.target.name]: e.target.value})
    }
    const handleClick = (e) => {
        e.preventDefault();
        let newValues = {}
        Object.keys(userInput).map((inputName) => {
            // console.log(inputName, userInput[inputName])
            if(inputName !== 'password') {
                if(userInput[inputName] !== userData[inputName]) {
                    newValues[inputName] = userInput[inputName];
                }
            }
        })
        if (userInput.password.length !== 0 &&
            userInput.password.length < 6) {
                setErrorMessage('Password too short - minimum 6 characters.')
                setSuccess(false);
                return;
        } else if (userInput.password.length >= 6) {
            newValues.password = userInput.password;
        }
        if(Object.entries(newValues).length === 0 && newValues.constructor === Object) {
            setErrorMessage('Du har inte ändrat några uppgifter')
            setSuccess(false);
            return;
        } else {
            newValues.id = userData.id;
        }
        Axios.put(API_PATH + '/update-account', {
            ...newValues
        })
        .then((response) => {
            console.log(response)
            // Rerouta användaren vid sucess.
            setErrorMessage(null)
            setSuccess(true)
            onLogIn(response.data);
        })
        .catch((error) => {
            console.log('Error!: ', error.response);
            setErrorMessage(error.response.data)
            setSuccess(false);
        })
        .finally(function () {
            // always executed
        });
    }
    const handleDelete = () => {
        // if(window.confirm('Are you sure?')){
            Axios.delete(API_PATH + '/delete-account', {
                data: {
                    id: userData.id
                }
            })
            .then((response) => {
                console.log('Svar delete:' ,response.data)
                console.log('userdata:' ,userData.id)
                onLogOut();
                // Rerouta användaren vid sucess.
            })
            .catch((error) => {
                console.log('Error!: ', error.response);
                setErrorMessage(error.response.data)
                setSuccess(false);
            })
            .finally(function () {
                // always executed
            });
        // } else {
        //     console.log('nej')
        // };
    }

    const nameChanger = (name) => {
        let newName;
        if(name === 'firstName') {
            newName = 'First name'
        } else if(name === 'lastName') {
            newName = 'Last name'
        } else if(name === 'password') {
            newName = 'Password';
        } else if(name === 'description') {
            newName = 'Description'
        } else if(name === 'username') {
            newName = 'Username'
        }
        return newName;
    }
    return ( 
        <div className={'mainContentStyle'}>
            <div className={'myAccount'}>
                <p className="title">My Account</p>
                <ul>
                {userInput && Object.keys(userInput).map((name, index) => {
                    return (
                        <li key={index}>
                            <label>{nameChanger(name)}</label>
                            {name !== 'description' ? 
                            <input 
                                type="text"
                                name={name}
                                value={userInput[name]}
                                onChange={handleChange}
                                required
                            />
                            :
                            <textarea 
                                onChange={handleChange}
                                type="text"
                                name={name}
                                value={userInput[name]}
                                className="createDescription"
                                maxLength="350"
                                required
                            />
                            
                            }
                        </li>
                    )
                })}
                    <li>
                        <button onClick={handleClick}>Ändra Uppgifter</button>
                    </li>
                    <li>
                        <button className='delete' onClick={handleDelete}>Ta bort mitt konto</button>
                    </li>
                    <li>
                        <p>{success?'Konto uppdaterat':errorMessage}</p>
                    </li>
                </ul>

            </div>
        </div>
     );
}
 
export default MyAccount;
