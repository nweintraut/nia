var redis   = require('redis');
var redisConfig = require('./redis_config');
var client  = redis.createClient(redisConfig.redisPort, redisConfig.redisHost, {});

client.on('error', function(error){
    console.log("Redis Error: [" + error + "]");
});
client.auth(redisConfig.redisAuthentication, function(error, reply){
    if(error) {
        console.log(">>>> Redis Authentication Failed: [" + error + ']');
    }
    else {
        console.log(">>>> Redis Authnetication Response is : [" + reply + "]");
    }
});
exports.client = client;
exports.redis = redis;