/**
 * Created by MS on 12-05-2015.
 */
var db = require('./db');
var mongoose = require('mongoose');

var User = mongoose.model('User');
var Activation = mongoose.model('Activation');

function _createNewUser(user, callback) {

    console.log(user);

    var newUser = new User({

        //Object here

    });

    newUser.save(function (err, user) {
        if (err) {
            return res.end(JSON.stringify({error: err.toString()}));
        }
        else {
            callback(null, JSON.stringify(user));
        }

    })

}

module.exports = {

    createNewUser: _createNewUser

};