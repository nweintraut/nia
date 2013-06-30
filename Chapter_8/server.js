var connect = require('connect');

// Cloud9: use 'process.env.PORT' as the port and 'process.env.IP' as the host in your scripts
process.env.PORT = process.env.PORT? process.env.PORT : "3000";
process.env.IP   = process.env.IP? process.env.IP : "127.0.0.1";

var app = connect()
    .use(connect.favicon())
    .use(connect.cookieParser('keyboard cat'))
    .use(connect.session())
    .use(function(req, res, next){
        var sess = req.session;
        if(sess.views) {
            res.setHeader('Content-Type', 'text/html');
            res.write('<p>views: ' + sess.views + '</p>');
            res.end();
            sess.views++;
        } else {
            sess.views = 1;
            res.end('welcome to the session demo. refresh!');
        }
    });

app.listen(process.env.PORT);