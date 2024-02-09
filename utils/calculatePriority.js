function calculatePriority(due_date) {
    const today = new Date()
    const dueDate = new Date(due_date);
    const timeDiff = dueDate.getTime() - today.getTime();
    //difference in days
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
  
    if(daysDiff < 0){
        return -1
    }
    else if (daysDiff === 0) {
      // due date is today
      return 0;
    } else if (daysDiff <= 2) {
      // due date is between tomorrow and day after tomorrow
      return 1;
    } else if (daysDiff <= 4) {
      // due date is within 3 to 4 days
      return 2;
    } else {
      // due date is 5+ days
      return 3;
    }
  } 

  module.exports = calculatePriority

