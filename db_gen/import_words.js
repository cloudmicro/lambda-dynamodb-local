var fs = require('fs');
var wordData = [];

fs.readFile('wordsEn.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  var words  = data.split('\n');
  for (wordIndex in words) {
    var word = words[wordIndex].replace('\r', '');
    if (word !== '') {
        wordData.push({
        "word": words[wordIndex].replace('\r', ''),
        "langauge_code" : "en"
        });
    }
  }
  fs.writeFile('tables_dynamodb_sampledata/words.json', JSON.stringify(wordData), function(err) {
    if (err) {
        console.log('error writing file: ' + err);
    }
  });
});