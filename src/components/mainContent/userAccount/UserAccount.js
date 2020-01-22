import React, {useState, useEffect, useContext} from 'react'
import Axios from 'axios';
import { AuthContext } from '../../../contexts/AuthContext';
import './style.css';

const API_PATH = 'http://localhost/wies/examensarbete/examensarbete/api/queryHandler.php'

const intressen = ['crossfit', 'löpning', 'kost', 'fotboll', 'cykla', 'coaching', 'badminton']

const UserAccount = (props) => {
    console.log(props);
    const [secondUser, setSecondUser] = useState(null);
    const {userData} = useContext(AuthContext)
    useEffect(() => {
        if(props.location.query) {
            setSecondUser(props.location.query.user)
            console.log(secondUser);
        } else {
            console.log('nada')
            const id = props.location.pathname.split('/user/')
            Axios.get(`${API_PATH}/user/${id[1]}`, {})
            .then((response) => {
                setSecondUser(response.data);
            })
            .catch((error) => {
                console.log(error.response);
            })
        }
        return () => {
            setSecondUser(null)
        };
    }, [])

    const handleClick = () => {
        if(userData.isAuthenticated) {
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
    }

    const handleBookingClick = () => {
        console.log('boka')
        props.history.push('/booking?' + secondUser.id)
    }
   
    
    return (
        <div className="mainContentStyle">
            {secondUser && 
            <div className="userAccount">
                <div className="name">
                    <p>{`${secondUser.firstName} ${secondUser.lastName}`}</p>
                </div>
                <div className="description">
                    <span>Om mig:</span>
                    <hr/>
                    <p>
                        {`${secondUser.description}`}
                    </p>
                </div>
                <div className="interests">
                    <span>Intressen</span>
                    <hr/>
                    <ul>
                        {intressen.map((intresse, index) => {
                            return <li key={index}><span></span>{intresse}</li>
                        })}
                    </ul>
                </div>
                <div className='btnContainer'>
                    <button className='chatBtn bookBtn' onClick={handleBookingClick}>
                        Boka tid med mig
                    </button>
                    <button className='chatBtn' onClick={handleClick}>
                        Chatta med mig
                    </button>
                </div>
                
            </div>
            }
        </div>

     
    )
}

export default UserAccount;