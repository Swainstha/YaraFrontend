/**
 * returns time in hour-minute-second format
 * @param   {string} date  - time in string format
 * @return  {string} - returns time in hour-minute-second format
 */
 export const getTimeInFormat = (date: Date) =>
 {
     const d = date ? new Date(date) : null
     if (d === null) return null
     const time = (d.getHours() < 10 ? ('0' + d.getHours()) : d.getHours()) + ":"
         + (d.getMinutes() < 10 ? ('0' + d.getMinutes()) : d.getMinutes()) + ":"
         + (d.getSeconds() < 10 ? ('0' + d.getSeconds()) : d.getSeconds());
     // console.log(time);
     return time;
 }
 
 /**
  * returns time in year-month-day format
  * @param   {string} date  - date in string/date format
  * @return  {string} - returns time in year-month-day format
  */
 export const getDateInFormat = (date: Date) =>
 {
     const d = date ? new Date(date) : null
     if (d === null) return null
     const dd = d.getFullYear() + "-"
         + (d.getMonth() < 10 ? ('0' + d.getMonth()) : d.getMonth()) + "-"
         + (d.getDay() < 10 ? ('0' + d.getDay()) : d.getDay());
     // console.log(time);
     return dd;
 }