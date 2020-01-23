import React, {useState, useEffect, useContext} from 'react'
import Axios from 'axios';
import { AuthContext } from '../../../contexts/AuthContext';

const API_PATH = 'http://localhost/wies/examensarbete/examensarbete/api/queryHandler.php'

const availableFrom = 8;
const availableTo = 17;
const BookableTimes = ({month, day, bookedTime, secondUserId}) => {
    const [timePeriods, setTimePeriods] = useState([]);
    const [chosenPeriod, setChosenPeriod] = useState(null);
    const [timeBooked, setTimeBooked] = useState(null); 
    const {userData} = useContext(AuthContext)

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
        Axios.post(API_PATH + '/bookMeeting', {
            data : {
                userId : userData.id,
                secondUserId,
                month,
                startTime : chosenPeriod[0].toString(),
                endTime   : chosenPeriod[1].toString(),
                day: day
            }
        })
        .then((response) => {
            console.log(response.data);

        })
        .catch((error) => {
            console.log('Error!: ', error.response);

        })
        .finally(function () {
            
        });
    }

    return (
        <React.Fragment>
            <div className="bookableTimes">
                {timePeriods.map((period, index) => {
                    // gjorde period[0] och 1 till nya variabler för att 
                    // de av någon anledningn var mutable
                    let timeFrom = (period[0] >= 10 ? period[0] : '0' + period[0]);
                    let timeTo   = (period[1] >= 10 ? period[1] : '0' + period[1])
                    let timeBooked = 'timeBooked';
                    let timeBookedBoolArr = bookedTime && bookedTime.map((time) => {
                        if(time[0] == period[0]) {
                            return true;
                        } else {
                            return false
                        }
                    })
                    const timeBookedBool = bookedTime ? timeBookedBoolArr.indexOf(true) > -1:
                    false; 
                    timeBooked +=  timeBookedBool ? 'True' : 'False'
                    return (
                        <div 
                            className={'container ' + timeBooked} 
                            key={index} 
                            onClick={!timeBookedBool ? () => handleClick(period):
                                    () => console.log('noppeee')}
                        >
                            <span className="timePeriod">
                                {
                                    timeFrom + '-' + timeTo
                                }
                            </span>
                        </div>
                    )
                })}
            </div>
            {chosenPeriod && 
            <p className="chosenTime">
                 Vald Tid: {(chosenPeriod[0] >= 10 ? chosenPeriod[0] : '0' + chosenPeriod[0]) + '-' +
                            (chosenPeriod[1] >= 10 ? chosenPeriod[1] : '0' + chosenPeriod[1])}
            </p>
            }
            <button className='bookBtn' onClick={handleBooking}>
                Boka tid med mig
            </button>
            
        </React.Fragment>
        
    )
}

export default BookableTimes;

// <p key={index}>
                //     {month}: {daysInMonth(new Date(2020, index))}
                // </p>