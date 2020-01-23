import React, {useState, useEffect, useContext} from 'react'
import Axios from 'axios';
import { AuthContext } from '../../../contexts/AuthContext';
import './bookableTimes.css';
const API_PATH = 'http://localhost/wies/examensarbete/examensarbete/api/queryHandler.php'

const availableFrom = 8;
const availableTo = 17;
// const BookableTimes = ({month, day, bookedTime, secondUserId}) => {
const BookableTimes = ({secondUserId, secondUsersBookedTimes, currentMonth, day}) => {
    const [timePeriods, setTimePeriods] = useState([]);
    const [chosenPeriod, setChosenPeriod] = useState(null);
    const {userData} = useContext(AuthContext)

    const [success, setSuccess] = useState(null);
    const [err, setErr] = useState('');

    useEffect(() => {
        let availableHoursArr = () => {
            let returnArr = [];
            for(let i = 0; i <= (availableTo - availableFrom); i+=2) {
                returnArr.push([availableFrom + i, availableFrom + 1 + i]);
            }
            return returnArr;
        }
        setTimePeriods(availableHoursArr);

        return () => {
            setTimePeriods(null);
        };
    }, []);

    const handleClick = (period) => {
        setChosenPeriod(period)
    }
    const handleBooking = () => {
        if(!chosenPeriod) {
            setErr('Du har inte vald någon tid');
            setSuccess(false);
            return null;
        }
        Axios.post(API_PATH + '/bookMeeting', {
            data : {
                userId : userData.id,
                secondUserId,
                month : currentMonth,
                startTime : chosenPeriod[0].toString(),
                endTime   : chosenPeriod[1].toString(),
                day: day
            }
        })
        .then((response) => {
            console.log(response.data);
            setErr('');
            setSuccess(true);
        })
        .catch((error) => {
            console.log('Error!: ', error.response);
            setErr('Kunde inte boka tid: "' + error.response.data + '"')
            setSuccess(false)
        })
        .finally(function () {
            
        });
    }

    return (
        <React.Fragment>
            <div className="bookableTimes">
                <div className="timeContainer">
                    {timePeriods.map((period, index) => {
                        // gjorde period[0] och 1 till nya variabler för att 
                        // de av någon anledningn var mutable
                        let timeFrom = (period[0] >= 10 ? period[0] : '0' + period[0]);
                        let timeTo   = (period[1] >= 10 ? period[1] : '0' + period[1])
                        let timeBooked = 'timeBooked';
                        let timeBookedBoolArr = secondUsersBookedTimes && 
                        secondUsersBookedTimes.map((time) => {
                            if(time[0] == period[0]) {
                                return true;
                            } else {
                                return false
                            }
                        })
                        const timeBookedBool = secondUsersBookedTimes ? 
                                timeBookedBoolArr.indexOf(true) > -1 : false; 
                        timeBooked +=  timeBookedBool ? 'True' : 'False'
                        return (
                            <div 
                                className={'container ' + timeBooked} 
                                key={index} 
                                onClick={!timeBookedBool ? () => handleClick([timeFrom, timeTo]):
                                        () => console.log('noppeee')}
                            >
                                <span className="timePeriod">
                                    { timeFrom + '-' + timeTo }
                                </span>
                            </div>
                        )
                    })}
                </div>
                {chosenPeriod && 
                <p className="chosenTime">
                    Vald Tid: {chosenPeriod[0]}-{chosenPeriod[1]}
                </p>
                }
                <button 
                    className='bookBtn' 
                    onClick={handleBooking}
                >
                    Boka tid med mig
                </button>  
                <p className="errMsg">{success ? 'Tid bokad' : err}</p>     
            </div>
        </React.Fragment>
    )
}
export default BookableTimes;