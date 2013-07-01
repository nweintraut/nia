var fs = require('fs');
var http = require('http');
var ejs = require('ejs');
var template = fs.readFileSync('./template/blog_page.ejs', 'utf8');


// Cloud9: use 'process.env.PORT' as the port and 'process.env.IP' as the host in your scripts
process.env.PORT = process.env.PORT? process.env.PORT : "3000";
process.env.IP   = process.env.IP? process.env.IP : "127.0.0.1";

function getEntries() {
    var entries = [];
    var entriesRaw = fs.readFileSync('./entries.txt', 'utf8');
    entriesRaw = entriesRaw.split('---');
    entriesRaw.map(function(entryRaw){
       var entry = {};
       var lines = entryRaw.split("\n");
       lines.map(function(line){
          if(line.indexOf('title: ') === 0) {
              entry.title = line.replace('title:', '');
          } else if (line.indexOf('date: ') === 0) {
              entry.date = line.replace('date: ', '');
          } else {
              entry.body = entry.body || '';
              entry.body += line;
          }
        });
        entries.push(entry);
    });  
    return entries;
}
var entries = getEntries();
console.log(entries);

function blogPage(entries) {
    var values = {entries: entries};
    return ejs.render(template, {locals: values});
}
var server = http.createServer(function(req, res){
    var output = blogPage(entries);
    res.writeHeader(200, {'Content-Type': 'text/html'});
    res.end(output);
});
server.listen(process.env.PORT);

