var http    = require('http');
var server  = http.createServer();
var url     = require('url');
var parse   = url.parse;
var join    = require('path').join;
var fs      = require('fs');
var root    = __dirname;
var items   = [];
var qs      = require('querystring');
var formidable = require('formidable');

// Cloud9: use 'process.env.PORT' as the port and 'process.env.IP' as the host in your scripts
process.env.PORT = process.env.PORT? process.env.PORT : "3000";
process.env.IP   = process.env.IP? process.env.IP : "127.0.0.1";

function show(response){
    var html = '<html><head><title>Formidable</title></head><body>';
    html += '<form method="POST" action="/" enctype="multipart/form-data">';
    html += '<p><input type="text" name="name" /></p>';
    html += '<p><input type="file" name="file" /></p>';
    html += '<p><input type="submit" value="Upload" /> </p>';
    html += '</form>';
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
function upload(request, response) {
    if(!isFormData(request)) {
        response.statusCode = 400;
        response.end('Bad Request: expecting multipart/form-data');
        return;
    }
    var form = new formidable.IncomingForm();
    form.on('field', function(field, value) {
        console.log("Input field name is: [" + field + "], Value is: [" + value + "]");
    });
    form.on('file', function(name, file) {
        console.log("[" + name +"] [" + "] File size is: [" + file.size + "] Filename is: [" + file.name + "]");
        console.log(file);
    });
    form.on('end', function(){
        response.end('upload complete');
    });
    form.parse(request);
}
function isFormData(request){
    var type = request.headers['content-type'] || '';
    return 0 === type.indexOf('multipart/form-data');
}
server.on('request', function(request, response){
    if ('/' === request.url) {
        switch (request.method) {
            case 'GET':
                show(response);
                break;
            case 'POST':
                upload(request, response);
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