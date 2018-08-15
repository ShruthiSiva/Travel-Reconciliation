const path = require('path');
const fs = require('fs');
const solc = require('solc');

const TripeurContractPath = path.resolve(__dirname, 'contracts', 'TripeurReport.sol');
const sourceTripeur = fs.readFileSync(TripeurContractPath, 'utf8');
const TBOContractPath = path.resolve(__dirname, 'contracts', 'TBOReport.sol');
const sourceTBO = fs.readFileSync(TBOContractPath, 'utf8');

module.exports.compiledTripeur = solc.compile(sourceTripeur, 1).contracts[':TripeurReport'];
module.exports.compiledTBO = solc.compile(sourceTBO, 1).contracts[':TBOReport'];
