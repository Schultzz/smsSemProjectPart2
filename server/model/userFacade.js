/**
 * Created by MS on 12-05-2015.
 */
var db = require('./db');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var User = mongoose.model('User');
var Activation = mongoose.model('Activation');


function _createNewUser(user, callback) {

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {

            console.log(user);

            var newUser = new User({
                    userName: user.userName,
                    email: user.email,
                    pw: hash,
                    activated: true
                }
            );

            newUser.save(function (err, user) {
                if (err) {
                    callback(JSON.stringify({error: err.toString()}), null);
                }
                else {
                    callback(null, JSON.stringify(user));
                }

            })

        })

    })

}

function _findAllUsers(callback) {

    User.find({}, function (err, users) {

        if (err) {
            return res.end(JSON.stringify({error: err.toString()}))
        }
        ;

        callback(null, users);

    })

}

module.exports = {

    createNewUser: _createNewUser,
    findAllUsers: _findAllUsers

};