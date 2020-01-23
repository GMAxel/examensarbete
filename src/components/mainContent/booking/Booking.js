import React, {useState, useEffect} from 'react'
import Calendar from './Calendar'
import './style.css';


    
const months_arr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
'September', 'October', 'November', 'December'];

/**
 * SELECT m.month, day, u.id, st.name, et.name
 * FROM meeting
 * WHERE userId = firstUser.id
 * OR userId = secondUser.id
 * AND month = selectedMonth
 * JOIN users as u ON meeting.userId = user.id
 * JOIN time as st ON meeting.startTimeId = time.id
 * JOIN time as et ON meeting.endTimeId = time.id
 * JOIN month as m ON meeting.monthId = month.id
 * 
 * Vi vill få ut bokade datum i månaden. 
 * fullybooked = bookedTimes.map((time) => {
 *  
 * })
 * if(day === fullybooked) {
 *      make_it_red_and_un_clickable;
 * }
 * Datastruktur:
 */

// const dataStructure = {
//     january: {
//         firstUser: {
//             1: [
//                 ['08', '09'], ['10', '11'], ['12', '13'], ['14', '15'], ['16', '17']
//             ],
//             2: [],
//             3: [],
//             etc: []
//         },
//         secondUser: {
//             1: [
//                 ['08', '09'], ['10', '11'], ['12', '13'], ['14', '15'], ['16', '17']
//             ],
//             2: [],
//             3: [],
//             etc: []
//         }
//     }
        
// }

// const data_month = dataStructure.january;
// const bookedHoursDuringDay = data_month.firstUser[day].concat(data_month.secondUser[day])

// if(dataStructure.january.firstUser[day].map)


const Booking = (props) => {
    const [month, setMonth] = useState(months_arr[new Date().getMonth()]);
    const [monthIndex, setMonthIndex] = useState(new Date().getMonth());

    const [dateClicked, setDateClicked] = useState({
        month: null,
        day: null,
        dayName: null
    });
    
    const secondUserId = props.location.search ? props.location.search.substr(1) :
    null;
    if(secondUserId === null) {
        return null;
    }

    const handleChange = (e) => {
        console.log(e.target.value)
        let monthName = e.target.value;
        let monthIndex = months_arr.indexOf(e.target.value);
        setMonth(monthName)
        setMonthIndex(monthIndex)
    }
    const handleChosenDate = () => {

    }

    return (
        <div className="mainContentStyle">
            <div className="booking">
                <select 
                    value={month} 
                    onChange={handleChange} 
                    className="selectMonth"
                >
                    {months_arr.map((month, index) => {
                        return (
                            <option key={index} value={month}>{month}</option>
                        )
                    })}
                </select>
                <Calendar 
                    handleChosenDate={handleChosenDate}
                    secondUserId={secondUserId} 
                    monthIndex={monthIndex} 
                    month={month} 
                />
            </div>
        </div>
    )
}
export default Booking;

// <p key={index}>
                //     {month}: {daysInMonth(new Date(2020, index))}
                // </p>

/**
 * Två state variabler - month och monthIndex.
 * När sidan laddas in så utgår vi från dagens
 * datum. 
 * Sedan skapar vi fyrkanter för varje dag 
 * i den månaden. Dagar med tider kvar blir
 * grön, dagar utan tider kvar blir röd.
 * Om du väljer en grön dag så får du upp 
 * en lista med tider. Som är gröna eller
 * röda beroende på om tiden är tillgänglig.
 * Sedan kan användaren välja en annan månad 
 */