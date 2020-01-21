import React, {useState} from 'react'
import Calendar from './Calendar'
    
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
'September', 'October', 'November', 'December'];


const Booking = () => {
    const [month, setMonth] = useState({
        index: 0,
        chosenMonth: 'January'
    });
 
    function daysInMonth(anyDateInMonth) {
        return new Date(anyDateInMonth.getFullYear(), 
                        anyDateInMonth.getMonth()+1, 
    0).getDate();}

    console.log(daysInMonth(new Date(2020, 1)))

    const handleChange = (e) => {
        console.log(e.target.value)
        console.log(months[e.target.value])
        setMonth({
            index: e.target.value,
            chosenMonth: months[e.target.value]
        })
    }

    const selectValues = () => {
        return (
            months.map((month, index) => {
                return (
                    
                        <option key={index} value={index}>{month}</option>
                )
            })
        )
    }
    console.log(month.chosenMonth)    

    return (
        <div className="mainContentStyle">
            <select value={month.chosenMonth} onChange={handleChange}>
                {selectValues()}
            </select>
            <Calendar month={month} />
        </div>

     
    )
}

export default Booking;

// <p key={index}>
                //     {month}: {daysInMonth(new Date(2020, index))}
                // </p>