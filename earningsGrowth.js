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

      if (mang.length > 5) {
        //console.log(mang[mang.length - 1]+'\n'+mang[mang.length - 2]+'\n'+mang[mang.length - 3]);
        var Avg3firstYear = (Number(mang[mang.length - 1])+Number(mang[mang.length - 2])+Number(mang[mang.length - 3]))/3;
        //console.log(Avg3firstYear);
        //console.log(mang[0]+'\n'+mang[1]+'\n'+mang[2]);
        var Avg3lastYear = (Number(mang[0])+Number(mang[1])+Number(mang[2]))/3;
        //console.log(Avg3lastYear);
        var Rate = (Avg3lastYear-Avg3firstYear)/Avg3firstYear;
        //console.log(Rate);
        db.query("Insert into earningsgrowth (id, Avg3firstYear, Avg3lastYear, Rate, numberOfyears) values ('"
                  +code+"','"+Avg3firstYear+"','"+Avg3lastYear+"','"+Rate+"','"+mang.length+"')",
        function(err,result){
          if(err) throw code+' '+err;
          console.log(code + ' inserted ' + Rate);
        })
      }
    })
}

var LineByLineReader = require('line-by-line'),
lr = new LineByLineReader('CodeList00.txt');
lr.on('line', function (line) {
	getEarnings(line);
  lr.pause();
    setTimeout(function () {
        // ...and continue emitting lines.
        lr.resume();
    }, 500);
});
