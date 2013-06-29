var http = require('http');
// Cloud9: use 'process.env.PORT' as the port and 'process.env.IP' as the host in your scripts
http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plaim'});
    res.end('Hello World\n');
}).listen(process.env.PORT);
console.log('Server running at ' + process.env.IP + ":" + process.env.PORT);