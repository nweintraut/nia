var redisConnect = require('./redisConnect');
var redis = redisConnect.redis;
var client = redisConnect.client;
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