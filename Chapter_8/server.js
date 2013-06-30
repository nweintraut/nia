var connect = require('connect');
var url     = require('url');
var fs      = require('fs');
var path    = require('path');

// Cloud9: use 'process.env.PORT' as the port and 'process.env.IP' as the host in your scripts
process.env.PORT = process.env.PORT? process.env.PORT : "3000";
process.env.IP   = process.env.IP? process.env.IP : "127.0.0.1";

connect.logger.token('query-string', function(req, res){
    return url.parse(req.url).query;
});
var verboseLogOutput = ':remote-addr -- [:date] "method: :method , url: :url , version: HTTP/:http-version" status: :status , accept: :res[Accept] , content-length: :res[Content-Length] ":referrer" ":user-agent" :response-time ms';
var logfile = null;
var logFileName =  (new Date()).toJSON() + '.txt';
var logDirectory = 'log';
var stats = fs.statSync(path.join(__dirname, logDirectory));
if (!stats.isDirectory()) {
    console.log("Log directory: " + logDirectory + ' either does not exist or is not a directory');    
} else {
    logfile = fs.createWriteStream(path.join(__dirname, logDirectory, logFileName), {flags: 'a'} );
}


function errorHandler() {
    var env = process.env.NODE_ENV || 'development';
    return function(err, req, res, next) { // by virtue of it having four arguments, connect makes it the error handler.
        console.log(err.stack);
        res.setHeader('Content-Type', 'application/json');
        if(err.notFound) {
            res.statusCode = 404;
            res.end(JSON.stringify({error: err.message}));
        } else {
            switch(env) {
                case 'development':
                    res.end(JSON.stringify({error: err.message}));
                    break;
                default:
                    res.end('Server error');
            }            
        }
    };
}
var app = connect()
    .use(connect.favicon()) // (path.join(__dirname, path_to_favicon))
    .use(connect.logger(':method :url :response-time ms'))
    .use(connect.logger({format: verboseLogOutput, immediate: true}))
    .use(connect.logger(':query-string'))
    .use(connect.logger('dev')) // colored output
    .use(connect.logger({format: ':method :url', stream: logfile})) // can specify buffer: <milliseconds>
    .use(connect.cookieParser('keyboard cat'))
    .use(connect.session())
    .use(function(req, res, next){
        var sess = req.session;
        if(sess.views) {
            req.session.cookie.expires = new Date(Date.now() +5000);
            req.session.cookie.maxAge = 5000;
            res.setHeader('Content-Type', 'text/html');
            res.write('<p>views: ' + sess.views + '</p>');
            res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>');
            res.write('<p>httpOnly: ' + sess.cookie.httpOnly + '</p>');
            res.write('<p>path: ' + sess.cookie.path + '</p>');
            res.write('<p>domain: ' + sess.cookie.domain + '</p>');
            res.write('<p>secure: ' + sess.cookie.secure + '</p>');
            res.end();
            sess.views++;
        } else {
            sess.views = 1;
            res.end('welcome to the session demo. refresh!');
        }
    })
    .use(errorHandler());

app.listen(process.env.PORT);