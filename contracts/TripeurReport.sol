pragma solidity^0.4.24;

contract TripeurReport {

    address admin;
    mapping(address => bool) accessPermisions;
    mapping(string => string) date2PNRMapping;
    mapping(string => string) datePNR2DetailsMapping;

    function TripeurReport() {
        admin = msg.sender;
        accessPermisions[admin] = true;
    }

    modifier adminOnly{
        require(msg.sender == admin);
        _;
    }

    modifier accessorsOnly{
        require(accessPermisions[msg.sender] == true);
        _;
    }

    function setAccessPermissions(address _accessor, bool _value) adminOnly {
        accessPermisions[_accessor] = _value;
    }

    function mapDateToPNRs(string _date, string _PNRs) adminOnly {
        date2PNRMapping[_date] = _PNRs;
    }

    function mapDatePNRToDetails(string _datePNR, string _details) adminOnly{
        datePNR2DetailsMapping[_datePNR] = _details;
    }

    function getPNRsOnDate(string _date) accessorsOnly public view returns(string _PNRs) {
        return date2PNRMapping[_date];
    }

    function getDetailsOfDatePNR(string _datePNR) accessorsOnly public view returns(string _details) {
        return datePNR2DetailsMapping[_datePNR];
    }
}
