var request = require('request');
var axios = require('axios');
var cheerio = require('cheerio');
var fs = require('fs');

var code = 'AAM';
var url = 'http://www.cophieu68.com/eventschedule.php?id='+code;
var mang = [];
var mang2 =[];
var j=0;
axios.get(url)
    .then(function(response){
      var $ = cheerio.load(response.data);

      $('div#events').find('td').each( function(index, element){
        mang[index] = $(this).text().replace(/(\r\n|\n|\r|\t)/gm,"");
      });

      mang.splice(0,mang.indexOf('1/'));
      mang.splice(mang.indexOf('Ngay giao dich dau tien'),mang.length-mang.indexOf('Ngay giao dich dau tien'));
      //console.log(mang);
      var file = fs.createWriteStream('event.txt');
      file.on('error', function(err) {
        console.log(err);
      });
      mang.forEach(function(v) {
        if ((mang.indexOf(v)+1) % 6 == 0){
          file.write(v + '\n');
          j++;
        } else {
          file.write(v + ', ');
          mang2[j]=mang2[j]+' '+v;
        }
      });
      console.log(mang2);
      file.end();
    })
