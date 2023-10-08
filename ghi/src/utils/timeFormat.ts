export const formatTime = (inputDate: string): string => {
  const date = new Date(inputDate);

  const months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()]; 

  const day = date.getDate(); 

  let hours = date.getHours(); 
  const ampm = hours >= 12 ? 'pm' : 'am'; 
  hours = hours % 12; 
  hours = hours ? hours : 12; 

  const year = date.getFullYear().toString().substr(-2); 

  return `${month} ${day} '${year} ${hours}${ampm}` ;
}