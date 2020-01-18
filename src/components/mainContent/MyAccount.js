import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const MyAccount = () => {
    const {userData} = useContext(AuthContext);
    return ( 
        <div className={'mainContentStyle'}>
            <div className={'myAccount'}>
                    <p>Förnamn: {userData.firstName}</p>
                    <p>Efternamn: {userData.lastName}</p>
                    <p>Användarnamn: {userData.username}</p>
                    <p>{userData.expiresIn}</p>
                    <p>{userData.description}</p>

            </div>
        </div>
     );
}
 
export default MyAccount;
