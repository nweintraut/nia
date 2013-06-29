var http    = require('http');
var server  = http.createServer();
var fs      = require('fs');
var path    = require('path');
var mime    = require('mime');
var chatServer  = require('./lib/chat_server');
var cache   = {};
// Cloud9: use 'process.env.PORT' as the port and 'process.env.IP' as the host in your scripts
process.env.PORT = process.env.PORT? process.env.PORT : "3000";
process.env.IP   = process.env.IP? process.env.IP : "127.0.0.1";

function send404(response){
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: resource not found.');
    response.end();
}
function sendFile(response, filePath, fileContents){
    response.writeHead(200, {'Content-Type': mime.lookup(path.basename(filePath))});
    response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function(exists){
            if(exists) {
                fs.readFile(absPath, function(err, data) {
                    if (err) {
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            } else {
                send404(response);
            }
        });
    }
}

server.on('request', function(request, response){
   var filePath = false;
   if (request.url == '/') {
       filePath = 'public/index.html';
   } else {
       filePath = 'public' + request.url;
   }
   var absPath = './' + filePath;
   serveStatic(response, cache, absPath);
});

server.listen(process.env.PORT, function() {
    console.log('Server running at http://' + process.env.IP + ":" + process.env.PORT + "/");
});

chatServer.listen(server);