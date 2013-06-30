var mongoose = require('mongoose');
require('../db_connections/mongodb_connection');

var schema = new mongoose.Schema({
    name: String,
    path: String
});
module.exports = mongoose.model('Photo', schema);