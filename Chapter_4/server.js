var http    = require('http');
var server  = http.createServer();
var url     = require('url');
var parse   = url.parse;
var join    = require('path').join;
var fs      = require('fs');
var root    = __dirname;
var items   = [];
var qs      = require('querystring');

// Cloud9: use 'process.env.PORT' as the port and 'process.env.IP' as the host in your scripts
process.env.PORT = process.env.PORT? process.env.PORT : "3000";
process.env.IP   = process.env.IP? process.env.IP : "127.0.0.1";

function show(response){
    var html = '<html><head><title>Todo List</title></head><body>';
    html += '<h1>Todo List</h1></ul>';
    html += items.map(function(item){
        return '<li>' + item + '</li>';
    }).join('');
    html += '</ul>';
    html += '<form method="post" action="/">';
    html += '<p><input type="text" name="item" /></p>';
    html += '<p><input type="submit" value="Add Item" /></p>';
    html += '</form></body></html>';
    response.setHeader('Content-Type', 'text/html');
    response.setHeader('Content-Length', Buffer.byteLength(html));
    response.end(html);
}

function notFound(response) {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/plain');
    response.end('Not Found');
}
function badRequest(response) {
    response.statusCode = 400;
    response.setHeader('Content-Type', 'text/plain');
    response.end('Bad Request');
}
function add(request, response) {
    var body = '';
    request.setEncoding('utf8');
    request.on('data', function(chunk){
        body += chunk;
    });
    request.on('end', function(){
        var obj = qs.parse(body);
        items.push(obj.item);
        show(response);
    });
}
server.on('request', function(request, response){
    if ('/' === request.url) {
        switch (request.method) {
            case 'GET':
                show(response);
                break;
            case 'POST':
                add(request, response);
                break;
            default:
                badRequest(response);
        }
    } else {
        notFound(response);
    }

});
server.listen(process.env.PORT, function() {
    console.log('Server running at http://' + process.env.IP + ":" + process.env.PORT + "/");
});