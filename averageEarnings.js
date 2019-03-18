var axios = require('axios');
var cheerio = require('cheerio');
var replaceall = require("replaceall");

var earning3 = '';
var earning2 = '';
var earning1 = '';
var averageEarnings = '';

axios.get('http://ivt.ssi.com.vn/CorporateFundIncomeStatement.aspx?Ticket=BCE')
  .then(function(response){
    var $ = cheerio.load(response.data);
    earning3 = $('#ctl00_mainContent_CorporateFundIncomeStatements1_lbBL73').text();
    earning2 = $('#ctl00_mainContent_CorporateFundIncomeStatements1_lbBL74').text();
    earning1 = $('#ctl00_mainContent_CorporateFundIncomeStatements1_lbBL75').text();
    console.log(earning3);
    console.log(earning2);
    console.log(earning1);
    averageEarnings = (replaceall('.','',earning3)+ replaceall('.','',earning2)+ replaceall('.','',earning1))/3;
    console.log('Average Earnings on last 3 years: '+averageEarnings);
  });
