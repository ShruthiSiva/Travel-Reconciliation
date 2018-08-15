var XLSX = require('xlsx');

var pathIndigo = "../AirlineInvoice/INDIGO CORP 1-31 MAY REPORT.xlsx";
var pathGoAir = "../AirlineInvoice/GO AIR CORP 1-31 MAY REPORT.xlsx";
var pathSpiceJet = "../AirlineInvoice/Spicejet 1-31-May 18 Report.xlsx";
var pathTBO = "../AirlineInvoice/TBO Air  1-30 April 18.xlsx";
//var pathTBO = "../AirlineInvoice/TBO AIR  Report 01 March 31"
module.exports.pathTBO = pathTBO;
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function buildStruct(path) {
  var workbook = XLSX.readFile(path);
  var sheet_name_list = workbook.SheetNames;
  let reportObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  return reportObject;
}
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function buildStructSpice(path) {
  var workbook = XLSX.readFile(path);
  var sheet_name_list = workbook.SheetNames;
  var lastCol = workbook.Sheets[sheet_name_list[0]]['!ref'].split(":")[1][0];
  var first = "A", last = lastCol;
  for (var n = 1; n<=13; n++){
    for(var i = first.charCodeAt(0); i <= last.charCodeAt(0); i++) {
  	   var letter = eval("String.fromCharCode(" + i + ")")
       workbook.Sheets[sheet_name_list[0]].splice(`${letter}${n}`);
     }
  }
  console.log(workbook.Sheets[sheet_name_list[0]]);
  let reportObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  return reportObject;
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function heirarchyIndiGo(arg1 = 'Transation Date'
, arg2 = 'RecordLocator'
, arg3 = 'BaseFare'
, arg4 = 'PaymentAmount') {

  var reportObject = buildStruct(pathIndigo);
  let newObj = {};

  reportObject.forEach((obj) => {
    if(newObj[obj[arg1]] === undefined){
      newObj[obj[arg1]] = {};
    }
    if(newObj[obj[arg1]][obj[arg2]] === undefined){
      newObj[obj[arg1]][obj[arg2]] = {};
    }
    newObj[obj[arg1]][obj[arg2]]['Base-Fare'] = obj[arg3];
    newObj[obj[arg1]][obj[arg2]]['Total'] = obj[arg4]

   });

   return newObj;
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function heirarchyGoAir(arg1 = 'Payment Date'
, arg2 = 'PNR'
, arg3 = 'Amount') {

  var reportObject = buildStruct(pathGoAir);
  let newObj = {};

  reportObject.forEach((obj) => {
    obj[arg1] = obj[arg1].split(" ")[0];
    if(newObj[obj[arg1]] === undefined){
      newObj[obj[arg1]] = {};
    }
    if(newObj[obj[arg1]][obj[arg2]] === undefined){
      newObj[obj[arg1]][obj[arg2]] = {};
    }
    newObj[obj[arg1]][obj[arg2]]['Total'] = obj[arg3]

   });

   return newObj;
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function heirarchySpiceJet(arg1 = 'Transation Date'
, arg2 = 'RecordLocator'
, arg3 = 'BaseFare'
, arg4 = 'PaymentAmount') {

  var reportObject = buildStructSpice(pathSpiceJet);
  //console.log(reportObject);
  let newObj = {};

  // reportObject.forEach((obj) => {
  //   if(newObj[obj[arg1]] === undefined){
  //     newObj[obj[arg1]] = {};
  //   }
  //   if(newObj[obj[arg1]][obj[arg2]] === undefined){
  //     newObj[obj[arg1]][obj[arg2]] = {};
  //   }
  //   newObj[obj[arg1]][obj[arg2]]['Base-Fare'] = obj[arg3];
  //   newObj[obj[arg1]][obj[arg2]]['Total'] = obj[arg4]
  //
  //  });
  //
  //  return newObj;
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function heirarchyTBO(arg1 = 'TRAVEL DATE/TIME'
, arg2 = 'PNR'
, arg3 = ' Total GST'
, arg4 = 'TotalAmount(Preferred Curr)') {

  var reportObject = buildStruct(pathTBO);
  let newObj = {};

  reportObject.forEach((obj) => {
    if(obj[arg1] === undefined || obj[arg1][0] != '2'){
      return;
    }
    obj[arg1] = obj[arg1].split(" ")[0];

    if(newObj[obj[arg1]] === undefined){
      newObj[obj[arg1]] = {};
    }
    if(newObj[obj[arg1]][obj[arg2]] === undefined){
      newObj[obj[arg1]][obj[arg2]] = {};
    }

    newObj[obj[arg1]][obj[arg2]]['Total'] = obj[arg4];

   });

   return newObj;
}


// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


var newObjIndigo = heirarchyIndiGo();
var newObjGoAir = heirarchyGoAir();
var newObjTBO = heirarchyTBO();
//heirarchySpiceJet();

module.exports.IndigoReport = heirarchyIndiGo;
module.exports.GoAirReport = heirarchyGoAir;
module.exports.TBOReport = heirarchyTBO;
