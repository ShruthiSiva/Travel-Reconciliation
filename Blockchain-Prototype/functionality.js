global.ganache = require('ganache-cli');
global.Web3 = require('web3');
global.web3 = new Web3(ganache.provider());
global.compiled = require('./compile.js');
global.fs = require('fs');
global.object = require('./Comparison-TBO-Tripeur.js');


global.errors = object.errors;
global.failcount = object.failcount;
global.failed = object.failed;
global.passcount = object.passcount;
global.passed = object.passed;

//console.log(failed);

global.GenerateReport = async() => {
  global.accounts = await web3.eth.getAccounts();
  global.admin = await accounts[0];

  global.report = await new web3.eth.Contract(JSON.parse(compiled.compiled.interface)).deploy({
    data: compiled.compiled.bytecode
  }).send({
    from: admin,
    gas: '1500000'
  });

  console.log(`Report generated at: ${report.options.address}`);
  console.log(`Admin: ${admin}`);

  var temp = {};
  failed.forEach(async (obj) => {
    if(temp[obj.DATE] === undefined){
      temp[obj.DATE] = obj.PNR;
    }else {
      temp[obj.DATE] = temp[obj.DATE] + "," + obj.PNR;
    }


    await report.methods.createDatePNRMapping(obj.DATE, temp[obj.DATE]).send({
      from: admin,
      gas: '1500000'
    });

    var concatenatedStringAmount = await (obj.DATE + obj.PNR + 'Amount');
    var concatenatedStringPercent = await (obj.DATE + obj.PNR + 'Percentage');

    await report.methods.setLoss(concatenatedStringAmount, String(obj.LOSS)).send({
      from: admin,
      gas: 1500000
    });
    await report.methods.setLoss(concatenatedStringPercent, String(obj.PERCENTLOSS)).send({
      from: admin,
      gas: 1500000
    });
  });

}

global.getFailedDates = async() => {

  for(var i = 0; i<failcount; i++) {
    var failedDates = await report.methods.getFailedDates(i).call({
      from: accounts[1],
    });
    console.log(failedDates);
  }
}

global.getFailedPNRs = async(date) => {
  var failedPNRs = await report.methods.getFailedPNRs(date).call({
    from: accounts[1]
  });
  console.log(failedPNRs);
}

global.getLoss = async(date, pnr, valueIn) => {
  var concatenatedString = date + pnr + valueIn;
  var loss = await report.methods.getLoss(concatenatedString).call({
    from: accounts[1]
  });
  console.log(loss);
}

require('repl').start({})
