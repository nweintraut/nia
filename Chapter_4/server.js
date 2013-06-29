var http    = require('http');
var server  = http.createServer();

// Cloud9: use 'process.env.PORT' as the port and 'process.env.IP' as the host in your scripts
process.env.PORT = process.env.PORT? process.env.PORT : "3000";
process.env.IP   = process.env.IP? process.env.IP : "127.0.0.1";

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

server.listen(process.env.PORT, function() {
    console.log('Server running at http://' + process.env.IP + ":" + process.env.PORT + "/");
});