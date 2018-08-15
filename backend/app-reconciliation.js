const express = require('express');
var {TripeurPath, pathTBO} = require('../paths');
const args = require('../args.js');
const objectsToCSV = require('objects-to-csv');
var join = require('join-by-keys');
var mainFunc = require('../generateCSVReport');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', "GET, POST, PUT, PATCH, DELETE, OPTIONS");

  next();
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.get('/', (req, res) => {
  res.send('welcome!');
})

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.get('/api/paths', (req, res) => {

  res.status(200).json({
      message: "Successful paths retrieval",
      TripeurPath: TripeurPath,
      pathTBO: pathTBO
  });

});


app.post('/api/paths', (req, res) => {

  var tripeur = req.body.tripeurPath;
  var tbo = req.body.tboPath;
  TripeurPath = tripeur;
  pathTBO = tbo;

  res.status(200).json({
      message: "Success",
      TripeurPath: TripeurPath,
      pathTBO: pathTBO
  });

});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


app.get('/api/args', (req, res) => {
  res.status(200).send(args.args);
});

app.put('/api/args/addArgs', (req, res) => {
  const arg = {
    id: args.args.length + 1,
    TripeurArg: req.body.TripeurArg,
    AirlineArg: req.body.AirlineArg,
    key: req.body.key
  };
  args.args.push(arg);
  res.send(args.args[args.args.length - 1]);
});

app.delete('/api/args/delete/:id' , (req, res) => {
  const arg = args.args.find(a => a.id === parseInt(req.params.id));
  if(!arg) {
    res.status(400).send('No arg found with id ', req.params.id);
    return;
  }
  const index = args.args.indexOf(arg);
  args.args.splice(index, 1);

  res.send(args.args);
});
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.put('/api/getExcel', (req, res) => {

  var tripeur = req.body.tripeur;
  var tbo = req.body.tbo;
  var argument = req.body.argument;
  console.log(tripeur)
  var mainReport = mainFunc(tripeur, tbo, argument.args);
  mainReport = join(mainReport, ['PNR', 'DEP. DATE']);
  new objectsToCSV(mainReport).toDisk(`${(TripeurPath.split("/")[2]).split(".")[0]}-${(pathTBO.split("/")[2]).split(".")[0]}.csv`);
  res.send(mainReport);
});



module.exports = app;
