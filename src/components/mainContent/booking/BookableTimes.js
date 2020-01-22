import React, {useState, useEffect} from 'react'

const availableFrom = 8;
const availableTo = 17;

const BookableTimes = ({month, day, bookedTime}) => {
    const [timePeriods, setTimePeriods] = useState([]);
    const [chosenPeriod, setChosenPeriod] = useState(null);
    
    console.log('bokad tid: ', bookedTime)
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
        };
    }, []);

    const handleClick = (period) => {
        setChosenPeriod(period)
    }
    const handleBooking = () => {
        console.log(chosenPeriod);
    }

    return (
        <React.Fragment>
            <div className="bookableTimes">
                {timePeriods.map((period, index) => {
                    period[0] = (period[0] >= 10 ? period[0] : '0' + period[0])
                    period[1] = (period[1] >= 10 ? period[1] : '0' + period[1])
                    let timeBooked = 'timeBooked';
                    let timeBookedBoolArr = bookedTime && bookedTime.map((time) => {
                        console.log(time[0], period[0])
                        if(time[0] == period[0]) {
                            return true;
                            timeBookedBoolArr.push(true)
                        } else {
                            return false
                        }
                    })
                    timeBooked += timeBookedBoolArr.indexOf(true) > -1 ? 'True' : 'False'
                    console.log(timeBookedBoolArr);

                    return (
                        <div className={'container ' + timeBooked} key={index} onClick={() => handleClick(period)}>
                            <span className="timePeriod">
                                {
                                    period[0] + '-' + period[1]
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