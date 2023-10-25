export const dtStrToLocalShortStr = (inputDate: string): string => {
  const date = new Date(inputDate);

  const months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()]; 

  const day = date.getDate(); 

  let hours = date.getHours(); 
  const ampm = hours >= 12 ? 'pm' : 'am'; 
  hours = hours % 12; 
  hours = hours ? hours : 12; 

  const year = date.getFullYear().toString().substr(-2); 

  return `${month} ${day} '${year}, ${hours}${ampm}` ;
}


// if you use dtToLocalISO16 on a date that's already in local time, you will not get the original time back; 
// instead, it will be adjusted incorrectly. 
export const dtToLocalISO16 = (utcDate: Date): string => {
  const localDate = new Date(utcDate);
  localDate.setMinutes(utcDate.getMinutes() - utcDate.getTimezoneOffset());
  return localDate.toISOString().slice(0, 16);
};
// same as above, but for UTC
// export const dtToUTC = (localDate: Date): Date => {
//   const utcDate = new Date(localDate);
//   utcDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset());
//   return utcDate;
// };
