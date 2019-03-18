var axios = require('axios');
var cheerio = require('cheerio');
var replaceall = require("replaceall");

var totalEquity = '';
var totalShares = '';
var bookValue = '';

axios.get('http://ivt.ssi.com.vn/CorporateFundBalanceSheet.aspx?Ticket=BCE')
  .then(function(response){
    $ = cheerio.load(response.data);
    totalEquity = $('#ctl00_mainContent_CorporateFundBalanceSheet1_lbBL147').text();
    console.log('Total Equity = '+totalEquity);

    axios.get('http://ivt.ssi.com.vn/CorporateSnapshot.aspx?Ticket=BCE')
      .then(function(response){
        $ = cheerio.load(response.data);
        totalShares = $('#ctl00_mainContent_Snapshot1_lbOustadingShare').text();
        console.log('Total Shares = '+totalShares);

        bookValue = (replaceall('.','',totalEquity))*1000000/(replaceall('.','',totalShares));
        console.log('Book Value = '+bookValue);
      });
  });
