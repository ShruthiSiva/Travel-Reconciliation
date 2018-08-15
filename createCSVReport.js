var {verify} = require('./Comparison-TBO-Tripeur.js');
var {pathTBO} = require('./paths.js');
var {TripeurPath} = require('./paths.js');

var createCSVReport = function(TripeurArg = 'Airline Gst', AirlineArg = ' Total GST', key = "==", pathTBO = pathTBO, TripeurPath=TripeurPath) {

  var object = verify(TripeurArg, AirlineArg, key, pathTBO = pathTBO, TripeurPath=TripeurPath);

  var errors = object.errors;
  var failcount = object.failcount;
  var failed = object.failed;
  var passcount = object.passcount;
  var passed = object.passed;
  var cancelled = object.cancelled;

  failed.forEach((obj) => {
    obj[`PASS/FAIL-${TripeurArg}`] = "FAIL";
  });

  passed.forEach((obj) => {
    obj[`PASS/FAIL-${TripeurArg}`] = "PASS";
  });
  var passFail = [];
  passFail = passFail.concat(passed).concat(failed).concat(errors).concat(cancelled);

  return passFail;

}

module.exports.createCSVReport = createCSVReport;
