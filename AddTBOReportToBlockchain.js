var Spinner = require('cli-spinner').Spinner;
var {pathTBO} = require('./paths.js');
var XLSX = require('xlsx');
var Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
console.log("Enter your wallet secret....");
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
global.getAuthorization = async (prov) => {

  var spinner = new Spinner('waiting on authorization... %s');
  spinner.setSpinnerString('|/-\\');
  spinner.start();

  global.provider = await new HDWalletProvider(
    `${prov}`,
    'https://rinkeby.infura.io/GqOzNArFNDdCb90D0Dp1'
  );
  global.web3 = await new Web3(provider);

  await web3.eth.getAccounts().then((accounts) => {
    global.admin = accounts[0];
    spinner.stop(true);
    console.log("User Initialized as: ", admin);
  });
}
var {compiledTBO} = require('./compile.js');
var {DateLoop} = require('./DateLoop');
const objectsToCSV = require('objects-to-csv');
const {encrypt, decrypt} = require('./encrypt.js');
var hash = require("crypto-js/sha256");
const publicKey = 'Shruthi@2207';
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

var report = function(){
  function buildStruct(pathTBO) {
    var workbook = XLSX.readFile(pathTBO);
    var sheet_name_list = workbook.SheetNames;
    let reportObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    return reportObject;
  }
  var trips = buildStruct(pathTBO);
  return trips;
}
var TBOtrips = report();

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
var dateToPNRString = async () => {

  temp = {};
  for(trip of TBOtrips){
    if(temp[trip['DATE']] === undefined) {
      var t = await encrypt(publicKey, trip['PNR']);
      temp[trip['DATE']] = `${t}`;
    }else {
      var r = await temp[trip['DATE']];
      var u = await encrypt(publicKey, trip['PNR']);
      temp[trip['DATE']] = `${r},${u}`;
    }
  };
  return temp;
}

var datePNRToDetails = async() => {
  var temp = {};
  for (trip of TBOtrips){
    var datePNR = trip['DATE']+hash(trip['PNR']);
    temp[datePNR] = await encrypt(publicKey, JSON.stringify(trip));
  };
  return temp;
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

global.deployContract = async() => {
  var spinner = new Spinner('Deploying contract... %s');
  spinner.setSpinnerString('|/-\\');
  spinner.start();
  global.accounts = await web3.eth.getAccounts();
  global.admin = accounts[0];
  var TBOContractAddr = await new web3.eth.Contract(JSON.parse(compiledTBO.interface)).deploy({
    data: compiledTBO.bytecode
  }).send({
    from: admin,
    gas: 1500000
  });
  spinner.stop(true);
  console.log(`TBO contract is at address: ${TBOContractAddr.options.address}`);
  console.log(`TBO Contract admin: ${admin}`);
}

global.addTBOReport = async(contractAddress) => {
  global.TBOContract = await new web3.eth.Contract(JSON.parse(compiledTBO.interface), contractAddress);
  var date2PNRs = await dateToPNRString();
  var i = 1;
  var k = 1;

  var spinner = new Spinner('Processing date-PNR mapping... %s');
  spinner.setSpinnerString('|/-\\');
  spinner.start();

  for (date of Object.keys(date2PNRs)){
    await TBOContract.methods.mapDateToPNRs(date, date2PNRs[date]).send({
      from: admin,
      gas: 1500000
    })
  };
  console.log("Date-PNR mapping Done!");

  var spinner = new Spinner('Processing date-PNR-Details mapping... %s');
  spinner.setSpinnerString('|/-\\');
  spinner.start();

  var datePNRDetails = await datePNRToDetails();

  for (datePNR of Object.keys(datePNRDetails)){
    await TBOContract.methods.mapDatePNRToDetails(datePNR, `${datePNRDetails[datePNR]}`).send({
      from: admin,
      gas: 3000000
    });
  };
  spinner.stop(true);
  console.log("DatePNRString - Details mapping Done!");
}

global.getPNROnDate = async(date, contractAddress, privateKey) => {
  var spinner = new Spinner('Fetching dates... %s');
  spinner.setSpinnerString('|/-\\');
  spinner.start();

  var dateNew = date.split('-');
  dateNew = dateNew[2] + dateNew[1] + dateNew[0];

  try {
    global.TBOContract = await new web3.eth.Contract(JSON.parse(compiledTBO.interface), contractAddress);
    var pnrs = await TBOContract.methods.getPNRsOnDate(dateNew).call({
      from: admin
    });
    pnrs = pnrs.split(',');
    spinner.stop(true);
    console.log(`List of PNRs on ${date}: `)
    for (pnr of pnrs){
      decrypt(privateKey, pnr).then(console.log);
    }
  } catch (err) {
    spinner.stop(true);
    console.log("You are either unauthorized to make this transaction, or have run out of gas.");
  }

}

global.getDetailsWithDatePNR = async(date, pnr, contractAddress, privateKey) => {
  var spinner = new Spinner('Fetching details... %s');
  spinner.setSpinnerString('|/-\\');
  spinner.start();

  var dateNew = date.split('-');
  dateNew = dateNew[2] + dateNew[1] + dateNew[0];

  try {
    global.TBOContract = await new web3.eth.Contract(JSON.parse(compiledTBO.interface), contractAddress);
    var datePNR = dateNew+hash(pnr);
    console.log(datePNR);
    TBOContract.methods.getDetailsOfDatePNR(datePNR).call({
      from: admin
    }).then(async(details) => {

      decrypt(privateKey, details).then((ans) => {
        console.log(ans);
        spinner.stop(true);
      });
    });
  } catch (err) {
    spinner.stop(true);
    console.log("You are either unauthorized to make this transaction, or have run out of gas.");
    console.log(err);
  }
}

global.setAccessPermissions = async(address, value, contractAddress) => {
  var a = 0;

  var spinner = new Spinner('Setting permissions... %s');
  spinner.setSpinnerString('|/-\\');
  spinner.start();

  global.TBOContract = await new web3.eth.Contract(JSON.parse(compiledTBO.interface), contractAddress);
  try{
    await TBOContract.methods.setAccessPermissions(address, value).send({
      from: admin,
      gas: 1500000
    });
  }catch(err) {
    spinner.stop(true);
    a = 1;
    console.log("Transaction could not go through");
  }
  if(a==0) {
    spinner.stop(true);
    console.log(`View permissions set to ${value} for ${address}`);
  }

}

global.makeExcelReport = async(dateFrom, dateTo, contractAddress, privateKey) => {
  var spinner = new Spinner('fetching your report... %s');
  spinner.setSpinnerString('|/-\\');
  spinner.start();

  try {
    global.TBOContract = await new web3.eth.Contract(JSON.parse(compiledTBO.interface), contractAddress);
    global.excel = [];
    var dates = DateLoop(dateFrom, dateTo);
    var pnrs;
    idate =0;
    ipnr = 0;
    for (date of dates) {
      dateNew = date.split('-');
      dateNew = dateNew[2] + dateNew[1] + dateNew[0];
      await TBOContract.methods.getPNRsOnDate(dateNew).call({
        from: admin
      }).then(async(pn_rs) => {
        pnrs = pn_rs.split(',');
        for (pnr of pnrs) {
        pnr = decrypt(privateKey, pnr);
        var datePNR = dateNew+hash(pnr);
        await TBOContract.methods.getDetailsOfDatePNR(datePNR).call({
          from: admin
        }).then(async(details) => {
          if(decrypt(privateKey, details)==''){
            return;
          }else{
            var a = await decrypt(privateKey, details);
            excel.push(JSON.parse(a));
            if(idate == dates.length - 1 && ipnr == pnrs.length - 1){
              spinner.stop(true);
              var ws = XLSX.utils.json_to_sheet(excel);
              var wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, "Sheet-1");
              XLSX.writeFile(wb, `${dateFrom}To${dateTo}TBO.xlsx`);
              console.log("Your Excel sheet is ready for viewing!");
            };
          };
        });
        ipnr++;
      };
    });
    idate++;
    };
  } catch (err) {
    console.log(err);
    spinner.stop(true);
    console.log("You are either unauthorized to make this transaction, or have run out of gas.");
  }
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

require('repl').start({})
