var redisConnect = require('./redisConnect');
var redis = redisConnect.redis;
var client = redisConnect.client;
// Cloud9: use 'process.env.PORT' as the port and 'process.env.IP' as the host in your scripts
process.env.PORT = process.env.PORT? process.env.PORT : "3000";
process.env.IP   = process.env.IP? process.env.IP : "127.0.0.1";

var net = require('net');
var server = net.createServer(function(socket){
    var subscriber;
    var publisher;
    socket.on('connect', function(){
       subscriber = redis.createClient();
       subscriber.subscribe('main_chat_room');
       subscriber.on('message', function(channel, message) {
           socket.write('Channel ' + channel + ': ' + message);
       });
    });
    publisher = redisConnect.createClient();
    socket.on('data', function(data){
       publisher.publish('main_chat_room', data); 
    });
    socket.on('end', function(){
       subscriber.unsubscribe('main_chat_room');
       subscriber.end();
       publisher.end();
    });
});
server.listen(process.env.PORT, function() {
    console.log('Server running at http://' + process.env.IP + ":" + process.env.PORT + "/");
});
/*
client.set('color', 'red', redis.print);
client.get('color', function(error, value){
    if (error){console.log(error);
    } else {
        console.log('Got: ' + value);
    }
});

client.hmset('camping', {
    'shelter': '2-person tent',
    'cooking': 'campstove'
}, redis.print);
client.hget('camping', 'cooking', function(error, value){
    if (error) {
        console.log(error);
    } else {
        console.log('Will be cooking with: ' + value);
    }
});
client.hkeys('camping', function(error, keys){
    if (error) {
        console.log(error);
    } else {
        keys.forEach(function(key){
            console.log('    ' + key);
        });
    }
});
client.lpush('tasks', 'Paint the bikeshed red.', redis.print);
client.lpush('tasks', 'Paint the bikeshed green.', redis.print);
client.lrange('tasks', 0, -1, function(error, items){
    if (error) {
        console.log(error);
    } else {
        items.forEach(function(item, i) {
            console.log (i + '   ' + item);
        });
    }
});
*/