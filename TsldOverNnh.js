var axios = require('axios');
var cheerio = require('cheerio');
var replaceall = require("replaceall");

var currAssets ='';
var currLiabilities ='';
var netCurrAssets = '';
var longTermDebt ='';

axios.get('http://ivt.ssi.com.vn/CorporateFundBalanceSheet.aspx?Ticket=TDC')
  .then(function(response){
    var $ = cheerio.load(response.data);
    currAssets = $('#ctl00_mainContent_CorporateFundBalanceSheet1_lbBL23').text();
    currLiabilities = $('#ctl00_mainContent_CorporateFundBalanceSheet1_lbBL95').text();
    netCurrAssets = replaceall('.','',currAssets)-replaceall('.','',currLiabilities);
    longTermDebt = $('#ctl00_mainContent_CorporateFundBalanceSheet1_lbBL111').text();

    console.log('currAssets/currLiabilities = '+replaceall('.','',currAssets)/replaceall('.','',currLiabilities));
    console.log('netCurrAssets = '+netCurrAssets);
    console.log('longTermDebt = '+replaceall('.','',longTermDebt));
  });
