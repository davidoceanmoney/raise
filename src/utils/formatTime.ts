export const formatDate = (timestamp: any): string => {
    const date = new Date(timestamp.seconds * 1000); 
    // console.log(date);
    
    const options: any = {
      day: "2-digit",
      month: "short",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    // console.log(options);
    const formattedDate = date
      .toLocaleString("en-GB", options)
      .replace(",", "");
    // console.log(formattedDate);
    return formattedDate;
  };

  export const getRemainingDays = (timestamp: any): string => {
    const currentDate = new Date();
    const originalDate = new Date(timestamp.seconds * 1000); // Convert Firebase timestamp
    const targetDate = new Date(originalDate.getTime() + 30 * 24 * 60 * 60 * 1000); // Add 30 days
  
    // Calculate the difference in milliseconds
    const timeDifference = targetDate.getTime() - currentDate.getTime();
  
    // Convert the difference to days
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
  
    if (daysDifference > 1) {
      return `in ${daysDifference} days`;
    } else if (daysDifference === 1) {
      return `in 1 day`;
    } else {
      return "On the way";
    }
  };