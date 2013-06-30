var path    = require('path');
var redisConnect = require(path.join(__dirname, '../db_connections', 'redis_connect'));


module.exports = function(options){
    if (options === null) options = {};
    var store = null;
    var storeType = options.store;
    delete options['store'];
    switch(storeType) {
        case 'redis':
            var connect = options.connect;
            delete options['connect'];
            var RedisStore  = require('connect-redis')(connect);
            var redisConfig = require(path.join(__dirname, '../private/redis_config'));
            options.host = redisConfig.redisHost;
            options.port = redisConfig.redisPort;
            options.pass = redisConfig.redisAuthentication;
            store = new RedisStore(options);
            break;
        default:
    }
    return store;
};
