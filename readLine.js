var readline = require('readline');
var fs = require('fs');

var myInterface = readline.createInterface({
  input: fs.createReadStream('CodeList.txt')
});

var url = 'http://ivt.ssi.com.vn/CorporateSnapshot.aspx?Ticket=';

myInterface.on('line', function (line) {
  console.log(url + line);
});
