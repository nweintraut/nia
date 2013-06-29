var http    = require('http');
var server  = http.createServer();
var url     = require('url');

// Cloud9: use 'process.env.PORT' as the port and 'process.env.IP' as the host in your scripts
process.env.PORT = process.env.PORT? process.env.PORT : "3000";
process.env.IP   = process.env.IP? process.env.IP : "127.0.0.1";
/*
server.on('request', function(request, response){
// Other fields/methods on response
//    response.setHeader('Content-Length', body.length);
//    response.setHeader('Content-Type', 'text/plain');
//    response.statusCode = 302;
    var url = 'http://google.com';
    var body = '<p>Redirecting to <a href=\"' + url + '\">' + url + '</a></p>';
    response.setHeader('Location', url);
    response.setHeader('Content-Length', body.length);
    response.setHeader('Content-Type', 'text/html');
    response.statusCode = 302;
    response.end(body);    
//    response.write("Hello World\n");
//    response.end();
});
*/
var items = [];
server.on('request', function(request, response){
    switch (request.method) {
        case 'POST': 
            var item = '';
            request.setEncoding('utf8');
            request.on('data', function(chunk){ item += chunk;});
            request.on('end', function(){
                items.push(item);
                response.end('OK\n');
            });
            
            break;
        case 'GET':
            response.setHeader('Content-Type', 'text/plain');
            response.statusCode = 200;
            items.forEach(function(item, i){
                response.write(i + ') ' + item + '\n');
            });
            response.end();
            break;
        case 'DELETE' : 
            var path = url.parse(request.url).pathname;
            var i = parseInt(path.slice(1), 10);
            if (isNaN(i)) {
                response.statusCode = 400;
                response.end ('Invalid item id');
            } else if (!items[i]) {
                response.statusCode = 404;
                response.end('Item not found');
            } else {
                items.splice(i, 1);
                response.end('OK\n');
            }
    }

});
server.listen(process.env.PORT, function() {
    console.log('Server running at http://' + process.env.IP + ":" + process.env.PORT + "/");
});