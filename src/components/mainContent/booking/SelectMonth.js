import React from 'react'
const SelectMonth = ({monthsArr, currentMonth, handleChangedMonth}) => {
    return (
            <select 
                value={currentMonth} 
                onChange={handleChangedMonth} 
                className="selectMonth"
            >
                {monthsArr.map((month, index) => {
                    return (
                        <option key={index} value={month}>{month}</option>
                    )
                })}
            </select>
    )
}
export default SelectMonth;