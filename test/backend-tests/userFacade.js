/**
 * Created by MS on 13-05-2015.
 */
global.TEST_DATABASE = "mongodb://localhost/TestDataBase";

var db = require('../../server/model/db');
var mongoose = require('mongoose');

var User = mongoose.model('User');

