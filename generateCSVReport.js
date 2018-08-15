const objectsToCSV = require('objects-to-csv');
var {createCSVReport} = require('./createCSVReport.js');
const {TripeurPath} = require('./paths.js');
const {pathTBO} = require('./paths.js');
var join = require('join-by-keys');
var {args} = require('./args.js')

var mainFunc = (TripeurPath, pathTBO, args) => {
  var generateCSVReport = function(args, pathTBO = pathTBO, TripeurPath=TripeurPath){
    var generatedReport = createCSVReport(TripeurArg = args.TripeurArg, AirlineArg = args.AirlineArg, key = args.key, pathTBO = pathTBO, TripeurPath=TripeurPath);
    return generatedReport;
  }

  var mainReport = [];
  var ind = 1;
  for(arg of args){

    var generatedReport = generateCSVReport(arg, pathTBO = pathTBO, TripeurPath=TripeurPath);
    mainReport = mainReport.concat(generatedReport);
    ind++;
  };
  if(ind = args.length){
    return mainReport;
  }

}

// var mainReport = mainFunc(TripeurPath, pathTBO, args);

module.exports = mainFunc;

// mainReport = join(mainReport, ['PNR', 'DEP. DATE']);
// new objectsToCSV(mainReport).toDisk(`${(TripeurPath.split("/")[2]).split(".")[0]}-${(pathTBO.split("/")[2]).split(".")[0]}.csv`);
