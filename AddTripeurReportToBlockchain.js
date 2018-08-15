var Spinner = require('cli-spinner').Spinner;
var {TripeurPath} = require('./paths.js');
var XLSX = require('xlsx');
var Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
//console.log("Enter your wallet secret....");
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
var getAuthorization = async (prov) => {
  return new Promise(async (resolve, reject) => {
    var spinner = new Spinner('waiting on authorization... %s');
    spinner.setSpinnerString('|/-\\');
    spinner.start();

    provider = await new HDWalletProvider(
      `${prov}`,
      'https://rinkeby.infura.io/GqOzNArFNDdCb90D0Dp1'
    );
    global.web3 = await new Web3(provider);

    await web3.eth.getAccounts().then((accounts) => {
      global.admin = accounts[0];
      spinner.stop(true);
      console.log("User Initialized as: ", admin);
      resolve(admin);
    });
  })
}
var {compiledTripeur} = require('./compile.js');
var {DateLoop} = require('./DateLoop');
const objectsToCSV = require('objects-to-csv');
const {encrypt, decrypt} = require('./encrypt.js');
var hash = require("crypto-js/sha256");
const publicKey = 'Shruthi@2207';
var alert = require("js-alert");
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

var report = function(TripeurPath = TripeurPath){
  function buildStruct(TripeurPath) {
    var workbook = XLSX.readFile(TripeurPath);
    var sheet_name_list = workbook.SheetNames;
    let reportObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    return reportObject;
  }
  var trips = buildStruct(TripeurPath);
  return trips;
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
var dateToPNRString = (TripeurPath = TripeurPath, publicKey=publicKey) => {
  return new Promise(async(resolve, reject) => {
    var trips = await report(TripeurPath = TripeurPath);
    temp = {};
    for (trip of trips) {
      if(temp[trip['DATE OF ISSUE']] === undefined) {
        var t = await encrypt(publicKey, trip['GDS PNR']);
        temp[trip['DATE OF ISSUE']] =  `${t}`;
      }else {
        var r =await temp[trip['DATE OF ISSUE']];
        var u = await encrypt(publicKey, trip['GDS PNR']);
        temp[trip['DATE OF ISSUE']] = `${r},${u}`;
      }
    };
    resolve(temp);
  })
}

var datePNRToDetails = async(TripeurPath = TripeurPath, publicKey=publicKey) => {
  return new Promise(async (resolve, reject) => {
    var trips = await report(TripeurPath = TripeurPath);
    var temp = {};
    for (trip of trips) {
      var datePNR = trip['DATE OF ISSUE']+hash(trip['GDS PNR']);
      temp[datePNR] = await encrypt(publicKey, JSON.stringify(trip));
    };
    resolve(temp);
  });

}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

var deployContract = async() => {
  return new Promise(async(resolve, reject)=>{
    var spinner = new Spinner('Deploying contract... %s');
    spinner.setSpinnerString('|/-\\');
    spinner.start();
    global.accounts = await web3.eth.getAccounts();
    global.admin = accounts[0];
    var TripeurContractAddr = await new web3.eth.Contract(JSON.parse(compiledTripeur.interface)).deploy({
      data: compiledTripeur.bytecode
    }).send({
      from: admin,
      gas: 1500000
    });
    spinner.stop(true);
    console.log(`Tripeur contract is at address: ${TripeurContractAddr.options.address}`);
    console.log(`Tripeur Contract admin: ${admin}`);
    resolve(TripeurContractAddr.options.address);
  });
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

var dateNum = 0;
var loaderDateNum;
var datePNRNum=0;
var loaderDatePNRNum;
var val1 = 0; var val2 = 0;

var addDates = (contractAddress, TripeurPath = TripeurPath, publicKey=publicKey) => {
  return new Promise(async(resolve, reject)=>{
    global.TripeurContract = await new web3.eth.Contract(JSON.parse(compiledTripeur.interface), contractAddress);
    dateToPNRString(TripeurPath = TripeurPath, publicKey=publicKey).then(async(date2PNRs) => {
      for (date of Object.keys(date2PNRs)){
        await TripeurContract.methods.mapDateToPNRs(date, date2PNRs[date]).send({
          from: admin,
          gas: 3000000
        });
        dateNum++;
        loaderDateNum = `Mapped ${dateNum} of ${Object.keys(date2PNRs).length} dates.`;
        alert.alert(loaderDateNum);
      };
      if(dateNum == Object.keys(date2PNRs).length){
        val1=1;
        resolve("Date-PNR mapping Done!");
      }
    });
  });
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

var addDetails = (contractAddress, TripeurPath = TripeurPath, publicKey=publicKey) => {
  return new Promise(async(resolve, reject)=>{
    global.TripeurContract = await new web3.eth.Contract(JSON.parse(compiledTripeur.interface), contractAddress);
    datePNRToDetails(TripeurPath = TripeurPath, publicKey=publicKey).then(async(datePNRDetails) => {
      for (datePNR of Object.keys(datePNRDetails)){
        await TripeurContract.methods.mapDatePNRToDetails(datePNR, `${datePNRDetails[datePNR]}`).send({
          from: admin,
          gas: 3000000
        });
        datePNRNum++;
        loaderDatePNRNum = `Mapped ${datePNRNum} of ${Object.keys(datePNRDetails).length} details`;
        alert.alert(loaderDatePNRNum);
        if(datePNRNum == Object.keys(datePNRDetails).length){
          val2=1;
          resolve("DatePNRString - Details mapping Done!");
        }
      };
    });
  });

}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

var addTripeurReport = (contractAddress, TripeurPath = TripeurPath, publicKey=publicKey) => {

  return new Promise((resolve, reject)=>{
    console.log('Mapping invoked...');
    addDates(contractAddress, TripeurPath = TripeurPath, publicKey=publicKey).then(() => {
      addDetails(contractAddress, TripeurPath = TripeurPath, publicKey=publicKey).then(() => {
        resolve('Successfully uploaded report to blockchain');
      });
    });
    });
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

var getPNROnDate = async(date, contractAddress, privateKey) => {
  return new Promise(async (resolve, reject) => {
    var decryptedPnrs = [];
    var spinner = new Spinner('Fetching dates... %s');
    spinner.setSpinnerString('|/-\\');
    spinner.start();

    try {
      global.TripeurContract = await new web3.eth.Contract(JSON.parse(compiledTripeur.interface), contractAddress);
      var pnrs = await TripeurContract.methods.getPNRsOnDate(date).call({
        from: admin
      });
      pnrs = pnrs.split(',');
      spinner.stop(true);
      console.log(`List of PNRs on ${date}: `)
      for (pnr of pnrs){
        decrypt(privateKey, pnr).then((newpnr) => {
          decryptedPnrs.push(newpnr);
        });
      }

      resolve(decryptedPnrs);

    } catch (err) {
      spinner.stop(true);
      console.log("You are either unauthorized to make this transaction, or have run out of gas.");
    }
  });
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

var getDetailsWithDatePNR = async(date, pnr, contractAddress, privateKey) => {

  return new Promise(async(resolve, reject) => {
    var spinner = new Spinner('Fetching details... %s');
    spinner.setSpinnerString('|/-\\');
    spinner.start();

    try {
      global.TripeurContract = await new web3.eth.Contract(JSON.parse(compiledTripeur.interface), contractAddress);
      var datePNR = date+hash(pnr);
      await TripeurContract.methods.getDetailsOfDatePNR(datePNR).call({
        from: admin
      }).then(async(details) => {
        var ans = await decrypt(privateKey, details);
        spinner.stop(true);
        resolve(JSON.parse(ans));
      });
    } catch (err) {
      spinner.stop(true);
      console.log("You are either unauthorized to make this transaction, or have run out of gas.");
    }
  })
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

var setAccessPermissions = async(address, value, contractAddress) => {

  return new Promise(async(resolve, reject) => {
    var spinner = new Spinner('Setting permissions... %s');
    spinner.setSpinnerString('|/-\\');
    spinner.start();

    global.TripeurContract = await new web3.eth.Contract(JSON.parse(compiledTripeur.interface), contractAddress);
    var a = 0;
    try{
      await TripeurContract.methods.setAccessPermissions(address, value).send({
        from: admin,
        gas: 3500000
      });
    }catch(err) {
      spinner.stop(true);
      a = 1;
      console.log("Transaction could not go through");
      console.log(err);
    }
    if(a==0) {
      spinner.stop(true);
      resolve(`View permissions set to ${value} for ${address}`);
    }
  })
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

var makeExcelReport = async(dateFrom, dateTo, contractAddress, privateKey) => {

  return new Promise(async(resolve, reject) => {
    var spinner = new Spinner('fetching your report... %s');
    spinner.setSpinnerString('|/-\\');
    spinner.start();

    try {
      global.TripeurContract = await new web3.eth.Contract(JSON.parse(compiledTripeur.interface), contractAddress);
      global.excel = [];
      var dates = DateLoop(dateFrom, dateTo);
      var pnrs;
      idate =0;
      ipnr = 0;
      for (date of dates) {

        await TripeurContract.methods.getPNRsOnDate(date).call({
          from: admin
        }).then(async(pn_rs) => {

          pnrs = pn_rs.split(',');
          for (pnr of pnrs) {
          pnr = await decrypt(privateKey, pnr);
          var datePNR = ''+date+hash(pnr);
          await TripeurContract.methods.getDetailsOfDatePNR(datePNR).call({
            from: admin
          }).then(async(details) => {
            var a = await decrypt(privateKey, details);
            excel.push(JSON.parse(a));
            if(idate == dates.length - 1 && ipnr == pnrs.length - 1){
              spinner.stop(true);
              var ws = XLSX.utils.json_to_sheet(excel);
              var wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, "Sheet-1");
              XLSX.writeFile(wb, `${dateFrom}To${dateTo}Tripeur.xlsx`);
              resolve("Your Excel sheet is ready for viewing!");
              };
          });
          ipnr++;
        };
      });
      idate++;
      };

    } catch (err) {
      spinner.stop(true);
      console.log("You are either unauthorized to make this transaction, or have run out of gas.");
      console.log(err);
    }

  })

}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = {
  getAuthorization: getAuthorization,
  deployContract: deployContract,
  addTripeurReport: addTripeurReport,
  getPNROnDate: getPNROnDate,
  getDetailsWithDatePNR: getDetailsWithDatePNR,
  setAccessPermissions: setAccessPermissions,
  makeExcelReport: makeExcelReport
}
// require('repl').start({})
