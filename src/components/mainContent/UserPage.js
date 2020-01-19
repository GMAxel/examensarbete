import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Axios from 'axios';

const API_PATH = 'http://localhost/wies/examensarbete/examensarbete/api/queryHandler.php'

const MyAccount = (props) => {
    const {userData} = useContext(AuthContext);
    const [secondUser, setSecondUser] = useState();

    useEffect(() => {
        if(secondUser !== null && userData.isAuthenticated) {
            Axios.post(API_PATH + '/find-users' + '/' + secondUser.id, {
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
                console.log(error.response);
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
        <div className={'mainContentStyle'}>
            <div className={'myAccount'}>
                    <p>Förnamn: {userData.firstName}</p>
                    <p>Efternamn: {userData.lastName}</p>
                    <p>Användarnamn: {userData.username}</p>
                    <p>{userData.expiresIn}</p>
                    <p>{userData.description}</p>
                    <button className='chatBtn' onClick={() => handleClick(user)}>
                        Chatta med mig!
                    </button>
            </div>
        </div>
     );
}
 
export default MyAccount;
