var {TripeurReport} = require('./TripeurReport');
var {TBOReport} = require('./AirlineReport');
var {Operators} = require('./operators.js');
var {pathTBO} = require('./paths.js');
var {TripeurPath} = require('./paths.js');
var verify = function(TripeurArg = 'NETPAYABLE', AirlineArg = 'TotalAmount(Preferred Curr)', key = '>=', pathTBO = pathTBO, TripeurPath=TripeurPath) {
  var errors = [];
  var passcount = 0;
  var failcount = 0;
  var failed =[];
  var passed = [];
  var cancelled = [];

  var TripeurInvoiceCheckCancel = TripeurReport(arg1 = 'BOOKING SITE'
    , arg2 = 'DEP DATE'
    , arg3 = 'GDS PNR'
    , arg4 = 'NETPAYABLE'
    , path= TripeurPath);

  var TBOInvoiceCheckCancel = TBOReport(arg1 = 'TRAVEL DATE/TIME'
    , arg2 = 'PNR'
    , arg3 = ' Total GST'
    , arg4 = 'TotalAmount(Preferred Curr)'
    , path = pathTBO);

  var TripeurInvoice = TripeurReport(arg1 = 'BOOKING SITE'
    , arg2 = 'DEP DATE'
    , arg3 = 'GDS PNR'
    , arg4 = TripeurArg
    , path= TripeurPath);

  var TBOInvoice = TBOReport(arg1 = 'TRAVEL DATE/TIME'
  , arg2 = 'PNR'
  , arg3 = ' Total GST'
  , arg4 = AirlineArg
  , path = pathTBO);

  Object.keys(TripeurInvoice['TBO']).forEach((date) => {
    var tboDate = date.split("-");
    tboDate = tboDate[2] + tboDate[1] + tboDate[0];
    if(TBOInvoice[tboDate] === undefined) {
      var temp4 = {};
      temp4['PNR'] = null;
      temp4['DEP. DATE'] = date;
      temp4[`PASS/FAIL-${TripeurArg}`] = 'DATE AVAILABLE ONLY ON TRIPEUR';


      errors.push(temp4);
      return;
    }
    var pnrs = Object.keys(TripeurInvoice['TBO'][date]);
    pnrs.forEach((pnr) => {
      if(pnr[0] === '-'){
        pnr = pnr.substring(1);
      }
      if(TBOInvoice[tboDate][pnr] === undefined) {
        var temp3 = {};
        temp3['PNR'] = pnr;
        temp3['DEP. DATE'] = date;
        temp3[`PASS/FAIL-${TripeurArg}`] = 'PNR AVAILABLE ONLY ON TRIPEUR';
        errors.push(temp3);
        return;
      }
      if (parseInt(TBOInvoiceCheckCancel[tboDate][pnr]['TotalAmount(Preferred Curr)']) < 0){
        temp2 = {};
        temp2['PNR'] = pnr;
        temp2['DEP. DATE'] = date;
        temp2[`TBO-${AirlineArg}`] = TBOInvoice[tboDate][pnr][AirlineArg];
        temp2[`TRIPEUR-${TripeurArg}`] = TripeurInvoice['TBO'][date][pnr].reduce(function(acc, val) {  return parseInt(acc) + parseInt(val); });
        temp2[`PASS/FAIL-${TripeurArg}`] = 'CANCELLED';
        cancelled.push(temp2);
        return;

      }else {
        if (Operators[key](TripeurInvoice['TBO'][date][pnr].reduce(function(acc, val) { return parseInt(acc) + parseInt(val); }), parseInt(TBOInvoice[tboDate][pnr][AirlineArg]))){
          var temp1 = {}
          temp1['PNR'] = pnr;
          temp1['DEP. DATE'] = date;
          temp1[`TBO-${AirlineArg}`] = TBOInvoice[tboDate][pnr][AirlineArg];
          temp1[`TRIPEUR-${TripeurArg}`] = TripeurInvoice['TBO'][date][pnr].reduce(function(acc, val) {  return parseInt(acc) + parseInt(val); });
          //temp['LOSS'] = TBOInvoice[tboDate][pnr].Total - TripeurInvoice['TBO'][date][pnr].reduce(function(acc, val) { return acc + val; });
          //temp['PERCENTLOSS'] = ((TBOInvoice[tboDate][pnr].Total - TripeurInvoice['TBO'][date][pnr].reduce(function(acc, val) { return acc + val; }))/TBOInvoice[tboDate][pnr].Total)*100;
          passed.push(temp1);
          passcount++;

        }else {
          var temp = {}
          temp['PNR'] = pnr;
          temp['DEP. DATE'] = date;
          temp[`TBO-${AirlineArg}`] = TBOInvoice[tboDate][pnr][AirlineArg];
          temp[`TRIPEUR-${TripeurArg}`] = TripeurInvoice['TBO'][date][pnr].reduce(function(acc, val) { return acc + val; });
          //temp['LOSS'] = TBOInvoice[tboDate][pnr].Total - TripeurInvoice['TBO'][date][pnr].reduce(function(acc, val) { return acc + val; });
          //temp['PERCENTLOSS'] = ((TBOInvoice[tboDate][pnr].Total - TripeurInvoice['TBO'][date][pnr].reduce(function(acc, val) { return acc + val; }))/TBOInvoice[tboDate][pnr].Total)*100;
          failed.push(temp);
          failcount++;
        }
      }
    });

  });

  return {errors, failcount, passcount, failed, passed, cancelled};

}


module.exports.verify = verify;
