var http = require('http');
var server = http.createServer();

// Cloud9: use 'process.env.PORT' as the port and 'process.env.IP' as the host in your scripts
process.env.PORT = process.env.PORT? process.env.PORT : "3000";
process.env.IP   = process.env.IP? process.env.IP : "127.0.0.1"

server.on('request', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\nUsing explicit emitter-style coding\n');
});

server.listen(process.env.PORT);

console.log('Server running at http://' + process.env.IP + ":" + process.env.PORT + "/");