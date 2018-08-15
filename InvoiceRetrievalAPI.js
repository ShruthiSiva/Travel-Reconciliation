var fs = require('fs');
var invoice = require('./InvoiceRetrievalAPI.json')
var comparisonObject = [];

for (var i = 0; i<invoice.length; i++){
  var ticketAmount = invoice[i].fareInfo.netAmountPayable;
  var travelType = invoice[i].invoiceInfo.serviceType;
  var pnr = invoice[i].flightInfo.PNR;
  var passengerName = invoice[i].passengerInfo.Title + " " + invoice[i].passengerInfo.FirstName + " " +invoice[i].passengerInfo.LastName;
  var ticketNumber = invoice[i].ticketInfo.ticketNo;
  var flightName = invoice[i].flightInfo.Segments[0].Airline.AirlineName;
  var flightNumber = invoice[i].flightInfo.Segments[0].Airline.AirlineCode + invoice[i].flightInfo.Segments[0].Airline.FlightNumber;

  comparisonObject[i] = {
    ticketAmount: ticketAmount,
    travelType: travelType,
    pnr: pnr,
    passengerName: passengerName,
    ticketNumber: ticketNumber,
    flightName: flightName,
    flightNumber: flightNumber
  }
}


//console.log(comparisonObject);

module.exports.ourInvoice = comparisonObject;
// console.log(`Ticket amount: ${ticketAmount}`);
// console.log(`Travel type: ${travelType}`);
// console.log(`PNR: ${pnr}`);
// console.log(`Name: ${passengerName}`);
// console.log(`Ticket number: ${ticketNumber}`);
// console.log(`Flight Name: ${flightName}`);
// console.log(`Flight Number: ${flightNumber}`);
