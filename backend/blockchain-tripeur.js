const express = require('express');
var{
  getAuthorization
  ,deployContract
  ,addTripeurReport
  ,getPNROnDate
  ,getDetailsWithDatePNR
  ,setAccessPermissions
  ,makeExcelReport
} = require('/Users/shruthisivasubramanian/Desktop/Ethereum-reconciliation/Phase5-Blockchain copy/AddTripeurReportToBlockchain.js');

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
  res.send('welcome blockchainers!');
})

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.post('/login', async(req, res) => {
  var seed = req.body.seedPhrase;
  console.log(seed)
  getAuthorization(seed).then((admin)=> {
    res.status(200).json({
      message: "Authorization successful",
      admin: admin
    });
  });
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.get('/deployContract', async(req, res) => {
  deployContract().then((addr) => {
    res.status(200).json({
      message: "Deployment successful",
      contractAddress: addr
    });
  });
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.put('/getPNRs', async(req, res) => {
  var date = req.body.date;
  var contractAddress = req.body.contractAddress;
  var privateKey = req.body.privateKey;
  getPNROnDate(date, contractAddress, privateKey).then((pnrs) => {
    res.status(200).json({
      message: "PNRs retrieved successfully",
      PNRs: pnrs
    });
  });
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.put('/getDetails', async(req, res) => {
  var date = req.body.date;
  var pnr = req.body.pnr;
  var contractAddress = req.body.contractAddress;
  var privateKey = req.body.privateKey;

  getDetailsWithDatePNR(date, pnr, contractAddress, privateKey).then((details) => {
    res.status(200).json({
      message: "Details retrieved successfully",
      details: details
    });
  });
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.put('/setAccessPermissions', async(req, res) => {
  var address = req.body.address;
  var contractAddress = req.body.contractAddress;
  var value = req.body.value;

  setAccessPermissions(address, value, contractAddress).then((result) => {
    res.status(200).json({
      message: "Permissions set successfully",
      result: result
    });
  });
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.put('/makeExcelReport', async(req, res) => {
  var dateFrom = req.body.dateFrom;
  var dateTo = req.body.dateTo;
  var contractAddress = req.body.contractAddress;
  var privateKey = req.body.privateKey;

  makeExcelReport(dateFrom, dateTo, contractAddress, privateKey).then((result) => {
    res.status(200).json({
      message: "Success",
      status: result
    });
  });
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.post('/addTripeurReport', async(req, res) => {
  var reportPath = req.body.reportPath;
  var contractAddress = req.body.contractAddress;
  var publicKey = req.body.publicKey;
  addTripeurReport(contractAddress, reportPath, publicKey).then((result) => {
    res.status(200).json({
      message: 'Success',
      status: result
    });
  });
});
module.exports = app;
