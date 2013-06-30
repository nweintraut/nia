var connect = require('connect');
var path    = require('path');
var connect = require('connect');
var RedisStore = require('connect-redis')(connect);

// Cloud9: use 'process.env.PORT' as the port and 'process.env.IP' as the host in your scripts
process.env.PORT        = process.env.PORT? process.env.PORT : "3000";
process.env.IP          = process.env.IP?   process.env.IP : "127.0.0.1";
process.env.NODE_ENV    = process.env.NODE_ENV || 'development';


var logDirectory = path.join(__dirname, 'log');
var logFilename  = null;

var sessionStore = require('./utilities/session_store')({store: 'redis', connect: connect});
console.log("Session store is: " + sessionStore + "]");

var hour = 3600000;
var sessionOptions = {
    secret: 'keyboard cat',
    key: 'connect.sid',
    cookie: {maxAge: 10000}
//    cookie: {maxAge: hour * 24, expires: new Date(Date.now() + 10000)}
};

var app = connect();

app.use(connect.favicon())
    .use(connect.cookieParser())
    .use(connect.session({store: new RedisStore({host: "slimehead.redistogo.com", port: "9285", pass: "202ce927a499e2238aaaa95b1430d956"}), secret: "goober"}))
    .use(function(req, res, next){
        var sess = req.session;
        if (!sess.cart){
            sess.cart = {items: [0]};
        } else {
            var i = sess.views ? sess.views : 0;
            sess.cart.items.push(i);
        }
        console.log(sess.cart);
        if(sess.views) {
            req.session.cookie.expires = new Date(Date.now() +10000);
            req.session.cookie.maxAge = 10000;
            res.setHeader('Content-Type', 'text/html');
            res.write('<p>views: ' + sess.views + '</p>');
            res.write('</p>key: ' + sess.key + '</p>');
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
    });
app.listen(process.env.PORT);