import React, { useEffect, useState, useContext } from 'react'
import Axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const API_PATH = 'http://localhost/wies/examensarbete/examensarbete/api/queryHandler.php'

const FindUsers = (props) => {
    const [users, setUsers] = useState([]);
    const [secondUser, setSecondUser] = useState(null);
    const {userData} = useContext(AuthContext);

    useEffect(() => {
        Axios.get(API_PATH + '/find-users', {})
        .then((response) => {
            // x = response.data;
            setUsers(response.data)
            console.log(response.data);
        })
        .catch((error) => {
            console.log(error.response);
            // Visa felet för användaren.
        })
        .finally(function () {
            // always executed
        });
        return() => {
            setUsers([])
        }
    }, [])
    useEffect(() => {
        if(secondUser !== null && userData.isAuthenticated) {
            Axios.post(`${API_PATH}/find-users/${secondUser.id}`, {
                user: {
                    id: userData.id,
                    name: userData.firstName + ' ' + userData.lastName

                },
                secondUser : {
                    id: secondUser.id,
                    name: secondUser.firstName + ' ' + secondUser.lastName
                }
            })
            .then((response) => {
                console.log('RESPONS: ', response)
                props.history.push('/chat?' + response.data);
            })
            .catch((error) => {
                console.log(error);
                // Visa felet för användaren.
            })
        } else if(secondUser !== null && !userData.isAuthenticated) {
            props.history.push('/login')
        }
    }, [secondUser]);
        
    const handleClick = (secondUser) => {
        console.log(secondUser);
        setSecondUser(secondUser)
    }



    return (
        <div className="mainContentStyle">
                <div className='findUsers'>
                    {users && users.map((user, index) => {
                        if(user.id !== userData.id) {
                            return (
                                <div className='findUserItem' key={index}>
                                        <p className='fullName'>{user.firstName + ' ' + user.lastName}</p>
                                        {<p className="description">{user.description ? user.description: 'About me...'}</p>}
                                        <button className='chatBtn' onClick={() => handleClick(user)}>
                                            Chatta med mig!
                                            </button>
                                </div>
                            )
                        }}
                    )}
                </div>
                
        </div>
    )
}

export default FindUsers;