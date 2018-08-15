var {TripeurReport} = require('./TripeurReport');
var {TBOReport} = require('./AirlineReport');

var errors = [];
var passcount = 0;
var failcount = 0;
var failed =[];

function verify() {
  var TripeurInvoice = TripeurReport(arg1 = 'BOOKING SITE'
    , arg2 = 'DEP DATE'
    , arg3 = 'GDS PNR'
    , arg5 = 'NETPAYABLE');

  var TBOInvoice = TBOReport(arg1 = 'TRAVEL DATE/TIME'
  , arg2 = 'PNR'
  , arg3 = ' Total GST'
  , arg4 = 'TotalAmount(Preferred Curr)');

  Object.keys(TripeurInvoice['TBO']).forEach((date) => {
    var tboDate = date.split("-");
    tboDate = tboDate[2] + tboDate[1] + tboDate[0];
    if(TBOInvoice[tboDate] === undefined) {
      errors.push(`Departure Date: ${tboDate} not available`);
      return;
    }
    var pnrs = Object.keys(TripeurInvoice['TBO'][date]);
    pnrs.forEach((pnr) => {
      if(pnr[0] === '-'){
        pnr = pnr.substring(1);
      }
      if(TBOInvoice[tboDate][pnr] === undefined) {
        errors.push(`PNR: ${pnr} not available on ${tboDate}`);
        return;
      }
      if (parseInt(TBOInvoice[tboDate][pnr].Total) < 0){
        return;
      }else {
        if (parseInt(TBOInvoice[tboDate][pnr].Total) <= TripeurInvoice['TBO'][date][pnr].reduce(function(acc, val) { return acc + val; })){
          passcount++;
        }else {
          var temp = {}
          //failed.push(`PNR: ${pnr}, Date: ${date}, TBO: ${TBOInvoice[tboDate][pnr].Total}, Tripeur: ${TripeurInvoice['TBO'][date][pnr].reduce(function(acc, val) { return acc + val; })}`);
          temp['PNR'] = pnr;
          temp['DATE'] = date;
          temp['TBO'] = TBOInvoice[tboDate][pnr].Total;
          temp['TRIPEUR'] = TripeurInvoice['TBO'][date][pnr].reduce(function(acc, val) { return acc + val; });
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
