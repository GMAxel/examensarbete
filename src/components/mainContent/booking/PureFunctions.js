export function daysInMonth(anyDateInMonth) {
    return new Date(
        anyDateInMonth.getFullYear(), 
        anyDateInMonth.getMonth()+1, 
        0)
        .getDate();
}

export function whichDay(month, day, year = '2020') {
    // Dayindex 0 = sunday.
    const dayIndex = new Date(`${month} ${day}, ${year}`).getDay()
    return dayIndex;
}

export const daysArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const monthsArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
'September', 'October', 'November', 'December'];