import React, {useState, useEffect} from 'react';
import BookableTimes from './BookableTimes';
import Axios from 'axios';

const API_PATH = 'http://localhost/wies/examensarbete/examensarbete/api/queryHandler.php'
function daysInMonth(anyDateInMonth) {
    return new Date(
        anyDateInMonth.getFullYear(), 
        anyDateInMonth.getMonth()+1, 
        0)
        .getDate();
}

const daysArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Om det är 17e så kan vi ta remaindern delat på 7 
// 17e
// 7 - 14 - +3=17e (wednesday)
// 17/7 remainder = 3.

function whichDay(month, day, year = '2020') {
    // Dayindex 0 = sunday.
    const dayIndex = new Date(`${month} ${day}, ${year}`).getDay()
    return dayIndex;
}


const Calendar = ({month, monthIndex, secondUserId}) => {
    const [nrOfDays, setNrOfDays] = useState();
    const [dateClicked, setDateClicked] = useState({
        month: null,
        day: null,
        dayName: null
    });
    const [bookedTime, setBookedTime] = useState({
        date: []
    })

    useEffect(() => {
        if(secondUserId) {
            Axios.post(API_PATH + '/getMeetings', {
                secondUserId,
                month
            })
            .then((response) => {
                setBookedTime(response.data)
            })
            .catch((error) => {
                console.log('Error!: ', error.response);
            })
            .finally(function () {
                // always executed
            });
            return () => {
                
            };
        }
        
    }, [month])
    useEffect(() => {
        if(monthIndex !== null && monthIndex !== undefined) {            
            const nrOfDaysInMonth = daysInMonth(new Date(2020, monthIndex))
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
    }, [month, monthIndex]);

    const handleClick = (day, dayName) => {
        setDateClicked({
            month,
            day,
            dayName
        })
    }
    return (
        <div className='calendar'>
            <p className="monthName">
                {!dateClicked.month ? month : month + ' ' + dateClicked.day + ', ' + dateClicked.dayName }
            </p>    
            
            {!dateClicked.month ? 
            <div className='month'> 
                {nrOfDays && nrOfDays.map((day) => {
                    let outDated = 'outDated';
                    if(new Date(`${month}/${day}/2020`).setHours(0,0,0,0) <= 
                    new Date().setHours(0,0,0,0)) {
                        outDated+='True';
                    } else if(bookedTime[day] && bookedTime[day].length === 5) {
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
                                () => handleClick(day, daysArr[whichDay(month, day)]):
                                () => console.log('Nope')
                            }>
                            <div className='day'>
                                <span className="dayNr">
                                    {day}
                                </span>
                                <span className="dayName">
                                    {daysArr[whichDay(month, day)]}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>:
            <BookableTimes month={dateClicked.month} day={dateClicked.day}/>
            }
        </div>
    )
}

export default Calendar;

// <p key={index}>
                //     {month}: {daysInMonth(new Date(2020, index))}
                // </p>