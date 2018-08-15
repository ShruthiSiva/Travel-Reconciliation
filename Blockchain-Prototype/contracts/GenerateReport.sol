pragma solidity^0.4.23;

contract GenerateReport {

    address admin;
    modifier adminOnly{
        require(msg.sender == admin);
        _;
    }

    mapping (string => string) private failedDates;
    mapping (string => string) private loss;
    string[] failedDatesArray;

    function GenerateReport() {
        admin = msg.sender;

    }

    function createDatePNRMapping(string _date, string _pnr) public adminOnly {
        failedDates[_date] = _pnr;
        failedDatesArray.push(_date);
    }

    function getFailedDates(uint index) public returns(string) {
        return failedDatesArray[index];
    }


    function getFailedPNRs(string _date) public constant returns(string) {
        return failedDates[_date];
    }

    function setLoss(string _concatenatedDatePNR, string _lossValue) public adminOnly {
        loss[_concatenatedDatePNR] = _lossValue;
    }


    function getLoss(string _concatenatedDatePNR) public constant returns(string) {
        return loss[_concatenatedDatePNR];

    }



}
