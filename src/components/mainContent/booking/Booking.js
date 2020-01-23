import React, {useState, useEffect} from 'react'
import Calendar from './Calendar'
import {monthsArr} from './PureFunctions'
import BookableTimes from './BookableTimes';
import SelectMonth from './SelectMonth'
import './booking.css';
import backBtn from '../chat4/backBtn.png';


const Booking = (props) => {
    // Vald månad. Default värde är dagens månad.
    const [currentMonth, setCurrentMonth] = useState(monthsArr[new Date().getMonth()]);
    const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());

    const [secondUsersBookedTimes, setSecondUsersBookedTimes] = useState({
        date: []
    })
    const [dayClicked, setDayClicked] = useState({
        day: null,
        dayName: null
    });
    
    const secondUserId = props.location.search ? props.location.search.substr(1) :
    null;
    if(secondUserId === null) {
        return null;
    }
    // När användaren byter månad.
    const handleChangedMonth = (e) => {
        let monthName = e.target.value;
        let monthIndex = monthsArr.indexOf(e.target.value);
        setCurrentMonth(monthName)
        setCurrentMonthIndex(monthIndex)
    }
    // Här hämtar vi den andra användarens bokade tider
    const getSecondUsersBookedTimes = (data) => {
        console.log(data);
        setSecondUsersBookedTimes(data);
    }
    // körs när användaren klickar på en dag i månaden.
    const handleClickedDay = (day, dayName) => {
        console.log(day);
        console.log(secondUsersBookedTimes[day])
        setDayClicked({
            day,
            dayName
        })
    }
    const goBackStep = (componentName) => {
        console.log(componentName)
        if(componentName === 'monthComponent') {
            console.log('month')
            props.history.push('/user/' + secondUserId);
        } else if(componentName === 'dayComponent') {
            console.log('day')
            setDayClicked({
                day: null,
                dayName: null
            })
        }
    }
    const whichComponent = dayClicked.day ? 'dayComponent' : 'monthComponent';
    return (
        <div className="mainContentStyle">
            <div className={"booking " + whichComponent}>
                <SelectMonth 
                    monthsArr={monthsArr}
                    currentMonth={currentMonth}
                    handleChangedMonth={handleChangedMonth}
                />
                <p className="monthName">
                    {!dayClicked.day ? currentMonth : currentMonth + ' ' + dayClicked.day + ', ' + dayClicked.dayName }
                </p> 
                {!dayClicked.day ? 
                    <React.Fragment>
                        <Calendar 
                            handleClickedDay={handleClickedDay}
                            dayClicked={dayClicked}
                            getSecondUsersBookedTimes={getSecondUsersBookedTimes}
                            secondUsersBookedTimes={secondUsersBookedTimes}
                            secondUserId={secondUserId} 
                            currentMonthIndex={currentMonthIndex} 
                            currentMonth={currentMonth} 
                        />
                        <button onClick={() => goBackStep(whichComponent)} className='backToMonthsBtn'>
                            <img src={backBtn}/>
                        </button>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <BookableTimes 
                            secondUserId={secondUserId} 
                            secondUsersBookedTimes={secondUsersBookedTimes[dayClicked.day]} 
                            currentMonth={currentMonth} 
                            day={dayClicked.day}
                        />
                        <button 
                            onClick={() => goBackStep(whichComponent)} 
                            className='backToMonthsBtn'
                        >
                            <img src={backBtn}/>
                        </button>
                    </React.Fragment>
                }
            </div>
        </div>
    )
}
export default Booking;