global.object = require('./Comparison-TBO-Tripeur.js');
const {TripeurPath} = require('./TripeurReport.js');
const {pathTBO} = require('./AirlineReport.js');

global.errors = object.errors;
global.failcount = object.failcount;
global.failed = object.failed;
global.passcount = object.passcount;
global.passed = object.passed;

failed.forEach((obj) => {
  obj['PASS/FAIL'] = "FAIL";
});

passed.forEach((obj) => {
  obj['PASS/FAIL'] = "PASS";
});




const objectsToCSV = require('objects-to-csv');

var passFail = passed.concat(failed).concat(errors);

new objectsToCSV(passFail).toDisk(`${TripeurPath.split("/")[2]}-${pathTBO.split("/")[2]}.csv`);
// new objectsToCSV(errors).toDisk('./errors.csv');
//console.log(errors);
