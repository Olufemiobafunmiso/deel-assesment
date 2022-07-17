exports.isEndDateGreater =(start, end)=>{
    const start_date = new Date(start);
    const end_date = new Date(end)
    return end_date >= start_date ;
  }

exports.padDate = (date , type)=>{

  const startOrEndDate = {
    start: `${date} 00:00:00`,
    end: `${date} 23:59:59`,
  };
  return startOrEndDate[type];
}


exports.getMonthDifference = (start, end)=>{
    const start_date = new Date(start);
    const end_date = new Date(end);
    return (
        end_date.getMonth() -
        start_date.getMonth() +
        12 * (end_date.getFullYear() - start_date.getFullYear())
    );
  }