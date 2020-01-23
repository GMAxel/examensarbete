import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import {daysInMonth, daysArr, whichDay} from './PureFunctions';
import './calendar.css';

const API_PATH = 'http://localhost/wies/examensarbete/examensarbete/api/queryHandler.php'

const Calendar = ({currentMonth, currentMonthIndex, secondUserId, handleClickedDay, 
                    getSecondUsersBookedTimes, secondUsersBookedTimes}) => {
    const [nrOfDays, setNrOfDays] = useState();
    // Hämtar alla bokade tider som secondUser har i DB.
    useEffect(() => {
        if(secondUserId) {
            Axios.post(API_PATH + '/getMeetings', {
                secondUserId,
                month: currentMonth
            })
            .then((response) => {
                getSecondUsersBookedTimes(response.data);
            })
            .catch((error) => {
                console.log('Error!: ', error.response);
            })
            return () => {
                // getSecondUsersBookedTimes({
                //     date: []
                // })
            };
        }
    }, [currentMonth])

    // Sätter antalet dagar i månaden i state.
    useEffect(() => {
        if(currentMonthIndex !== null && currentMonthIndex !== undefined) {          
            const nrOfDaysInMonth = daysInMonth(new Date(2020, currentMonthIndex))
            let nrOfDaysInMonthArr = () => {
                let returnArr = [];
                for(let i = 1; i <= nrOfDaysInMonth; i++) {
                    returnArr.push(i);
                }
                return returnArr;
            }
            setNrOfDays(nrOfDaysInMonthArr())
        }

        return () => {
            setNrOfDays(null);
        };
    }, [currentMonthIndex]);

    // Sätter vilken dag i månaden använadren klickat på.
    const handleClick = (day, dayName) => {
        handleClickedDay(day, dayName)
    }

    return (
        <div className='month'> 
            {nrOfDays && nrOfDays.map((day) => {
                let outDated = 'outDated';
                let currentDate = new Date().setHours(0,0,0,0);
                let calendarDate = new Date(`${currentMonth}/${day}/2020`).setHours(0,0,0,0)
                if(currentDate > calendarDate) {
                    outDated+='True';
                } else if(secondUsersBookedTimes[day] && secondUsersBookedTimes[day].length === 5) {
                    outDated+='True';
                }
                else {
                    outDated+='False';
                }
                return (
                    <div 
                        className={'dayContainer ' + outDated} 
                        key={day} 
                        onClick={outDated === 'outDatedFalse' ? 
                                () => handleClick(day, daysArr[whichDay(currentMonth, day)]):
                                () => console.log('Nope')}
                    >
                        <div className='day'>
                            <span className="dayNr">
                                {day}
                            </span>
                            <span className="dayName">
                                {daysArr[whichDay(currentMonth, day)]}
                            </span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Calendar;