const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname, 'contracts', 'GenerateReport.sol');
const source = fs.readFileSync(contractPath, 'utf8');

module.exports.compiled = solc.compile(source, 1).contracts[':GenerateReport'];
