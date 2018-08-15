//Base fare, GST and netpayable have to be added

var XLSX = require('xlsx');
var path = "../TripeurInvoice/report2.xlsx";
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function buildStruct(path) {
  var workbook = XLSX.readFile(path);
  var sheet_name_list = workbook.SheetNames;
  let reportObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  return reportObject;
}
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

var reportObject = buildStruct(path);

var heirarchy = function(arg1 = 'BOOKING SITE'
, arg2 = 'DEP DATE'
, arg3 = 'GDS PNR'
, arg4 = 'NETPAYABLE') {

  let newObj = {};

  reportObject.forEach((obj) => {
    obj[arg1] = obj[arg1].toUpperCase();
    if(newObj[obj[arg1]] === undefined){
      newObj[obj[arg1]] = {};
    }
    obj[arg2] = obj[arg2].toUpperCase();
    if(newObj[obj[arg1]][obj[arg2]] === undefined){
      newObj[obj[arg1]][obj[arg2]] = {};
    }
    if(newObj[obj[arg1]][obj[arg2]][obj[arg3]] === undefined){
      newObj[obj[arg1]][obj[arg2]][obj[arg3]] = [];
    }

    newObj[obj[arg1]][obj[arg2]][obj[arg3]].push(parseInt(obj[arg4]));

   });

   return newObj;
}
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports.TripeurReport = heirarchy;
