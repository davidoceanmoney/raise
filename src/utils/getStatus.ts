export const getStatus = (timestamp: any): string => {
    
    const timestampDate = new Date(timestamp.seconds * 1000); 

     
    const currentDate = new Date();

     
    const timeDifference = currentDate.getTime() - timestampDate.getTime();  

     
    const daysDifference = timeDifference / (1000 * 3600 * 24);  
    if (daysDifference >= 90) {
      return "Withdraw"; 
    } else {
      return "Locked";  
    }
  };