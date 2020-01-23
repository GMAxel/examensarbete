import React, {useState, useEffect, useContext} from 'react';
import Axios from 'axios';
import { AuthContext } from '../../../contexts/AuthContext';

const API_PATH = 'http://localhost/wies/examensarbete/examensarbete/api/queryHandler.php'


const MyMeetings = () => {
    const {userData} = useContext(AuthContext);
    const [meetings, setMeetings] = useState()
    useEffect(() => {
        if(userData.isAuthenticated) {
            Axios.post(API_PATH + '/getAllMeetings', {
                id : userData.id,
            })
            .then((response) => {
                console.log(response.data);
                setMeetings(response.data);
            })
            .catch((error) => {
                console.log('Error!: ', error.response);
            })
            return () => {

            };
        }
    }, [userData])

    return (
        <div className="mainContentStyle">
            <table className="meetingTable"> 
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Month</th>
                        <th>Day</th>
                        <th>Time</th>
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
                                    {month}, {day}, {startTime}, {endTime}: {name}
                                </td>
                                <td>
                                    {month}, {day}, {startTime}, {endTime}: {name}
                                </td>
                                <td>
                                    {month}, {day}, {startTime}, {endTime}: {name}
                                </td>
                                <td>
                                    {month}, {day}, {startTime}, {endTime}: {name}
                                </td>
                            </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
}

export default MyMeetings;
