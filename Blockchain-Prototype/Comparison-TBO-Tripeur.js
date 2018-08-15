var {TripeurReport} = require('./TripeurReport');
var {TBOReport} = require('./AirlineReport');

var errors = [];
var passcount = 0;
var failcount = 0;
var failed =[];
var passed = [];

function verify() {
  var TripeurInvoice = TripeurReport(arg1 = 'BOOKING SITE'
    , arg2 = 'DEP DATE'
    , arg3 = 'GDS PNR'
    , arg4 = 'NETPAYABLE');

  var TBOInvoice = TBOReport(arg1 = 'TRAVEL DATE/TIME'
  , arg2 = 'PNR'
  , arg3 = ' Total GST'
  , arg4 = 'TotalAmount(Preferred Curr)');

  Object.keys(TripeurInvoice['TBO']).forEach((date) => {
    var tboDate = date.split("-");
    tboDate = tboDate[2] + tboDate[1] + tboDate[0];
    if(TBOInvoice[tboDate] === undefined) {
      //errors.push(`Departure Date: ${tboDate} not available`);
      var temp = {};
      temp['PNR'] = null;
      temp['DEP. DATE'] = tboDate;
      temp['AVAILABLE ONLY ON'] = 'TRIPEUR';
      errors.push(temp);
      return;
    }
    var pnrs = Object.keys(TripeurInvoice['TBO'][date]);
    pnrs.forEach((pnr) => {
      if(pnr[0] === '-'){
        pnr = pnr.substring(1);
      }
      if(TBOInvoice[tboDate][pnr] === undefined) {
        //errors.push(`PNR: ${pnr} not available on ${tboDate}`);
        var temp = {};
        temp['PNR'] = pnr;
        temp['DEP. DATE'] = tboDate;
        temp['PASS/FAIL'] = 'AVAILABLE ONLY ON TRIPEUR';
        errors.push(temp);
        return;
      }
      if (parseInt(TBOInvoice[tboDate][pnr].Total) < 0){
        return;
      }else {
        if (parseInt(TBOInvoice[tboDate][pnr].Total) <= TripeurInvoice['TBO'][date][pnr].reduce(function(acc, val) { return acc + val; })){
          var temp = {}
          temp['PNR'] = pnr;
          temp['DEP. DATE'] = date;
          temp['TBO'] = TBOInvoice[tboDate][pnr].Total;
          temp['TRIPEUR'] = TripeurInvoice['TBO'][date][pnr].reduce(function(acc, val) { return acc + val; });
          temp['LOSS'] = TBOInvoice[tboDate][pnr].Total - TripeurInvoice['TBO'][date][pnr].reduce(function(acc, val) { return acc + val; });
          temp['PERCENTLOSS'] = ((TBOInvoice[tboDate][pnr].Total - TripeurInvoice['TBO'][date][pnr].reduce(function(acc, val) { return acc + val; }))/TBOInvoice[tboDate][pnr].Total)*100;
          passed.push(temp);
          passcount++;

        }else {
          var temp = {}
          //failed.push(`PNR: ${pnr}, Date: ${date}, TBO: ${TBOInvoice[tboDate][pnr].Total}, Tripeur: ${TripeurInvoice['TBO'][date][pnr].reduce(function(acc, val) { return acc + val; })}`);
          temp['PNR'] = pnr;
          temp['DEP. DATE'] = date;
          temp['TBO'] = TBOInvoice[tboDate][pnr].Total;
          temp['TRIPEUR'] = TripeurInvoice['TBO'][date][pnr].reduce(function(acc, val) { return acc + val; });
          temp['LOSS'] = TBOInvoice[tboDate][pnr].Total - TripeurInvoice['TBO'][date][pnr].reduce(function(acc, val) { return acc + val; });
          temp['PERCENTLOSS'] = ((TBOInvoice[tboDate][pnr].Total - TripeurInvoice['TBO'][date][pnr].reduce(function(acc, val) { return acc + val; }))/TBOInvoice[tboDate][pnr].Total)*100;
          failed.push(temp);
          failcount++;
        }
      }
    });

  });

  // console.log(`Passed: ${passcount}, Failed: ${failcount}`);
  // console.log(`Unable to find: ${errors.length} entries`);

}
verify();

module.exports.errors = errors;
module.exports.failcount = failcount;
module.exports.passcount = passcount;
module.exports.failed = failed;
module.exports.passed = passed;
