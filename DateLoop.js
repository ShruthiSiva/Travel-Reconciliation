var DateLoop = (startDate, endDate) => {
  var dates = [];
  startDate = startDate.split('-');
  startDate = startDate[2] + "-" + startDate[1] + "-" + startDate[0];
  endDate = endDate.split('-');
  endDate = endDate[2] + "-" + endDate[1] + "-" + endDate[0];
  var start = new Date(startDate); //yyyy-mm-dd
  var end = new Date(endDate); //yyyy-mm-dd

  while(start <= end){

      var mm = ((start.getMonth()+1)>=10)?(start.getMonth()+1):'0'+(start.getMonth()+1);
      var dd = ((start.getDate())>=10)? (start.getDate()) : '0' + (start.getDate());
      var yyyy = start.getFullYear();
      var date = dd+"-"+mm+"-"+yyyy; //yyyy-mm-dd

      dates.push(date);

      start = new Date(start.setDate(start.getDate() + 1)); //date increase by 1
  }

  return dates;
}

module.exports.DateLoop = DateLoop;
