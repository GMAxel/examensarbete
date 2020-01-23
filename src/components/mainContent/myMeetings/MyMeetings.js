import React, {useState, useEffect, useContext} from 'react';
import Axios from 'axios';
import { AuthContext } from '../../../contexts/AuthContext';
import './style.css'
const API_PATH = 'http://localhost/wies/examensarbete/examensarbete/api/queryHandler.php'


const MyMeetings = () => {
    const {userData} = useContext(AuthContext);
    const [meetings, setMeetings] = useState(false)
    const [deletedMeeting, setDeletedMeeting] = useState();
    useEffect(() => {
        if(userData.isAuthenticated) {
            
            Axios.post(API_PATH + '/getAllMeetings', {
                id : userData.id,
            })
            .then((response) => {
                console.log(response.data);
                if(response.data[0]) {
                    setMeetings(response.data);
                }
            })
            .catch((error) => {
                console.log('Error!: ', error.response);
            })
            return () => {
                setMeetings(false)
                setDeletedMeeting(false);
            };
        }
    }, [userData, deletedMeeting]);


    const handleDelete = (id) => {
        if(window.confirm('Are you sure?' + id)){
            Axios.delete(API_PATH + '/delete-meeting', {
                data: {
                    id
                }
            })
            .then((response) => {
                console.log('Svar delete:' , response.data)
                // Rerouta användaren vid sucess.
                setDeletedMeeting(true);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
        } else {
            console.log('nej')
        };
    }
    return (
        <div className="mainContentStyle">
            {meetings ? 
            <table className="meetingTable"> 
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Month</th>
                        <th>Day</th>
                        <th>Time</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {meetings && meetings.map((meeting, index) => {
                    let name;
                    if(userData.firstName === meeting.firstNameUser &&
                        userData.lastName === meeting.lastNameUser) {
                        name = meeting.firstNameSecondUser + ' ' + meeting.lastNameSecondUser;
                    } else {
                        name = meeting.firstNameUser + ' ' + meeting.lastNameUser;
                    }
                    const {month, day, startTime, endTime} = meeting;
                    return (
                            <tr key={index}>
                                <td>
                                    {name}
                                </td>
                                <td>
                                    {month}
                                </td>
                                <td>
                                    {day}
                                </td>
                                <td>
                                   {startTime}-{endTime}
                                </td>
                                <td>
                                    <button 
                                        className='delete' 
                                        onClick={() => handleDelete(meeting.id)}>
                                            x
                                    </button>
                                </td>
                            </tr>
                    )
                })}
                </tbody>
            </table>
            : <p 
                style={{textAlign:'center', marginTop:'30px', fontSize:'30px', fontWeight:'bold'}}>
                    Du har inga möten bokade
            </p>
            }
        </div>
    )
}

export default MyMeetings;
