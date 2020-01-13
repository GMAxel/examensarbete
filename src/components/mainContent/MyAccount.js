import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const MyAccount = () => {
    const {isAuthenticated, firstName, lastName, username} = useContext(AuthContext);
    return ( 
        <div className={'mainContentStyle'}>
            <div className={'myAccount'}>
                <h3>Kontouppgifter: {isAuthenticated}</h3>
                    <p>Förnamn: {firstName}</p>
                    <p>Efternamn: {lastName}</p>
                    <p>Användarnamn: {username}</p>
            </div>
        </div>
     );
}
 
export default MyAccount;
