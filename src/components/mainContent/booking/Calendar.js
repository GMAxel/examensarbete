import React, {useState} from 'react'


const Calendar = (month) => {
    function daysInMonth(anyDateInMonth) {
        return new Date(anyDateInMonth.getFullYear(), 
                        anyDateInMonth.getMonth()+1, 
    0).getDate();}

    console.log(daysInMonth(new Date(2020, 1)))
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
     'September', 'October', 'November', 'December'];

    return (
        
        <div className="mainContentStyle">
            <div className='calendar'>
                
            </div>
        </div>

     
    )
}

export default Calendar;

// <p key={index}>
                //     {month}: {daysInMonth(new Date(2020, index))}
                // </p>