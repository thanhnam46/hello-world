var axios = require('axios');
var axiosRetry=require('axios-retry');
var cheerio = require('cheerio');
var replaceall = require("replaceall");
var fs = require('fs');
var readline = require('readline');
var date = require('date-and-time');

var db = require('./demo_mysql.js');

var company = {
  id:"",
  annual_sales:"",
  current_assets:"",
  current_liabilities:"",
  long_term_debt:"",
  debt:"",
  equity:""
};
axiosRetry(axios, { retries: 3 });
function getOthers(code){
  axios.get('http://ivt.ssi.com.vn/CorporateFundBalanceSheet.aspx?Ticket='+code)
    .then(function(response){
      var $ = cheerio.load(response.data);
      company.current_assets = replaceall('.','',$('#ctl00_mainContent_CorporateFundBalanceSheet1_lbBL24').text())*1000000;
      if(!company.current_assets){
        company.current_assets = replaceall('.','',$('#ctl00_mainContent_CorporateFundBalanceSheet1_lbBL23').text())*1000000;
      }
      company.current_liabilities=replaceall('.','',$('#ctl00_mainContent_CorporateFundBalanceSheet1_lbBL96').text())*1000000;
      if(!company.current_liabilities){
        company.current_liabilities = replaceall('.','',$('#ctl00_mainContent_CorporateFundBalanceSheet1_lbBL95').text())*1000000;
      }
      company.long_term_debt=replaceall('.','',$('#ctl00_mainContent_CorporateFundBalanceSheet1_lbBL132').text())*1000000;
      if(!company.long_term_debt){
        company.long_term_debt = replaceall('.','',$('#ctl00_mainContent_CorporateFundBalanceSheet1_lbBL131').text())*1000000;
      }
      company.debt=replaceall('.','',$('#ctl00_mainContent_CorporateFundBalanceSheet1_lbBL136').text())*1000000;
      if(!company.debt){
        company.debt = replaceall('.','',$('#ctl00_mainContent_CorporateFundBalanceSheet1_lbBL135').text())*1000000;
      }
      company.equity=replaceall('.','',$('#ctl00_mainContent_CorporateFundBalanceSheet1_lbBL148').text())*1000000;
      if(!company.equity){
        company.equity = replaceall('.','',$('#ctl00_mainContent_CorporateFundBalanceSheet1_lbBL147').text())*1000000;
      }
      var now = "'"+date.format(new Date(),'YYYY/MM/DD HH:mm:ss')+"'";
      //console.log(now);
      var sql = "update company set current_assets ="+company.current_assets
                +",current_liabilities="+company.current_liabilities
                +",long_term_debt="+company.long_term_debt
                +",debt="+company.debt
                +",equity="+company.equity
                +",date="+ now
                +" where id = '"+code+"'";
      db.query(sql,function(err, result){
        if(err) throw err;
        console.log(code + " Updated");
      })
    });
}
var LineByLineReader = require('line-by-line'),
lr = new LineByLineReader('CodeList.txt');
lr.on('line', function (line) {
	getOthers(line);
  lr.pause();
    setTimeout(function () {
        // ...and continue emitting lines.
        lr.resume();
    }, 500);
});
