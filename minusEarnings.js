var request = require('request');
var axios = require('axios');
var cheerio = require('cheerio');
var fs = require('fs');
var db = require('./demo_mysql.js');

var url = 'http://database.cophieu68.vn/incomestatement.php?id=';
var mang = [];

function getEarnings(code){
  axios.get(url+code+'&view=ist&year=-1')
    .then(function(response){
      var $ = cheerio.load(response.data);

      $('div#finance').find('td').each( function(index, element){
        mang[index] = $(this).text().replace(/(\r\n|\n|\r|\t|,| )/g,"");
      });
      mang.splice(0,mang.indexOf('Lợinhuậnsauthuếthunhậpdoanhnghiệp')+1);
      mang.splice(mang.indexOf('KhốiLượng'),mang.length-mang.indexOf('KhốiLượng'));
      mang.splice(mang.indexOf(''),mang.length-mang.indexOf(''));

      mang.forEach(function(v) {
        mang[mang.indexOf(v)] = v.replace(v.substring(v.indexOf('('),v.indexOf(')')+1),"");
      });

      for (var i = 0; i < mang.length; i++) {
        if (mang[i] < 0) {
          db.query("Insert into minusearnings (id, minusEarnings) values ('"+code+"','"+mang[i]+"')",function(err,result){
            if(err) throw code+err;
            console.log(code + ' inserted ' + mang[i]);
          })
          break;
        }
      }
      //console.log(code+' '+mang);
    })
}

var LineByLineReader = require('line-by-line'),
lr = new LineByLineReader('CodeList0.txt');
lr.on('line', function (line) {
	getEarnings(line);
  lr.pause();
    setTimeout(function () {
        // ...and continue emitting lines.
        lr.resume();
    }, 500);
});
