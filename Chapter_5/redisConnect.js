var redis   = require('redis');
var redisConfig = require('./redis_config');

function createClient(){
    var client  = redis.createClient(redisConfig.redisPort, redisConfig.redisHost, {});
    client.on('error', function(error){
        console.log("Redis Error: [" + error + "]");
    });
    client.auth(redisConfig.redisAuthentication, function(error, reply){
        if(error) {
            console.log(">>>> Redis Authentication Failed: [" + error + ']');
        } else {
            console.log(">>>> Redis Authnetication Response is : [" + reply + "]");
        }
    });
    return client;
}   
    
    
exports.createClient = createClient;
exports.client = createClient();
exports.redis = redis;