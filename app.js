var axios = require('axios');
var axiosRetry=require('axios-retry');
var cheerio = require('cheerio');
var replaceall = require("replaceall");
var db = require('./demo_mysql.js');

var suffix = 'http://ivt.ssi.com.vn/CorporateSnapshot.aspx?Ticket=';
var url ='';
axiosRetry(axios, { retries: 3 });

var json = {
            code : "",
            price : "",
            WeightedSharesOutstanding: ""
          };

function getPW(line){
  url = suffix + line;
  axios.get(url)
    .then(function(response){
      var $ = cheerio.load(response.data);
      json.code     = $('#ctl00_mainContent_CorporateHeader1_lbStock').text();
      json.price    = replaceall(',','.',$('.up_arrow_on_right1').text());
      if(!json.price){
        json.price    = replaceall(',','.',$('.no_change_on_right1').text());
      }
      if(!json.price){
        json.price    = replaceall(',','.',$('.down_arrow_on_left1').text());
      }
      json.WeightedSharesOutstanding = replaceall('.','',$('#ctl00_mainContent_Snapshot1_lbOustadingShare').text());
      console.log(json.WeightedSharesOutstanding);
      var sql= "update earningsgrowth set CurrentPrice='"+json.price
                +"', WeightedSharesOutstanding='"+json.WeightedSharesOutstanding
                +"' where id='"+line+"'";
      console.log(sql);
      db.query(sql, function(err,result){
        if(err) throw line+' '+err;
        console.log(line   + ' updated ' + json.price + ' ' + json.WeightedSharesOutstanding);
      });
  });
}

var LineByLineReader = require('line-by-line'),
lr = new LineByLineReader('afterEarning.txt');
lr.on('line', function (line) {
	getPW(line);
  lr.pause();
    setTimeout(function () {
        // ...and continue emitting lines.
        lr.resume();
    }, 500);
});
