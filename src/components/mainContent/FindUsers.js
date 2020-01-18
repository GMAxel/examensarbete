import React, { useEffect, useState, useContext } from 'react'
import Axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const API_PATH = 'http://localhost/wies/examensarbete/examensarbete/api/queryHandler.php'

const FindUsers = (props) => {
    const [users, setUsers] = useState([]);
    const [secondUser, setSecondUser] = useState(null);
    const {userData} = useContext(AuthContext);

    useEffect(() => {
        Axios.get(API_PATH + '/chat', {})
        .then((response) => {
            // x = response.data;
            setUsers(response.data.body)
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
            const abortController = new AbortController();

            Axios.post(API_PATH + '/chat' + '/' + secondUser.id, {
                user: {
                    id: userData.id,
                    name: userData.firstName + ' ' + userData.lastName

                },
                secondUser : {
                    id: secondUser.id,
                    name: secondUser.name
                }
            })
            .then((response) => {
                console.log(response)
                console.log(props);
                props.history.push('/chat?' + response.data);
            })
            .catch((error) => {
                console.log(error.response);
                // Visa felet för användaren.
            })
            return() => {
                abortController.abort();
            }
        }
    }, [secondUser]);
        
    const handleClick = (secondUser) => {
        console.log(secondUser)
        setSecondUser(secondUser)
    }


    return (
        <div className="mainContentStyle">
            <h4>Click on user to start chatting with them!</h4>
                <div className='userList'>
                    {users.map((user, index) => {
                        return (
                            // <Link className='userListItem' to={"/chat?" + user.id}>
                            <div className='userListItem' key={index} onClick={() => handleClick(user)}>
                                    <p className='fullName'>{user.name}</p>
                                    <p className='lastMessage'>Helt galen ka....</p>
                                    <p className="timeStamp">10:00</p>
                            </div>
                            // /* </Link> */
                        )
                    })}
                </div>
                
        </div>
    )
}

export default FindUsers;