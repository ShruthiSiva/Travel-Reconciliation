//Base fare, GST and netpayable have to be added

var XLSX = require('xlsx');
//var path = "../TripeurInvoice/01-05-2018To01-05-2018Tripeur.xlsx";
var {TripeurPath} = require('./paths.js');
var path = TripeurPath;
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function buildStruct(path) {
  var workbook = XLSX.readFile(path);
  var sheet_name_list = workbook.SheetNames;
  let reportObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  return reportObject;
}
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------




var heirarchy = function(arg1 = 'BOOKING SITE'
, arg2 = 'DEP DATE'
, arg3 = 'GDS PNR'
, arg4 = 'Airline Gst'
, path = path) {

  var reportObject = buildStruct(path);
  let newObj = {};

  reportObject.forEach((obj) => {
    if(obj[arg4] === undefined) {
      obj[arg4] = 0;
    }
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

    newObj[obj[arg1]][obj[arg2]][obj[arg3]].push(obj[arg4]);

   });

   return newObj;
}
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports.TripeurReport = heirarchy;
