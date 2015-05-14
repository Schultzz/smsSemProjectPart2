/**
 * Created by MS on 12-05-2015.
 */
var db = require('./db');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');

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
                    activated: false,
                    role: user.role
                }
            );

            var newActivation = new Activation({
                email: newUser.email,
                activationCode: new Array(15 + 1).join((Math.random().toString(36) + '00000000000000000').slice(2, 18)).slice(0, 15)
            })


            newUser.save(function (err, user) {
                if (err) {
                    callback(JSON.stringify({error: err.toString()}), null);
                }
                else {
                    newActivation.save(function (err) {
                        if (err) {
                            //handlecode
                        }
                        else {
                            if (typeof global.DEACTIVATE_EMAIL_SYSTEM == "undefined") {
                                console.log("in mail system");
                                _sendVerificationEmail(newActivation, newUser);
                            }

                            callback(null, JSON.stringify(user));
                        }
                    })

                }

            })

        })

    })

}

function _sendVerificationEmail(activation, user) {

// create reusable transporter object using SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'semprojectgrp1@gmail.com',
            pass: 'lakslaks'
        }
    });

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
    var url = 'http://localhost:3000/publicApi/activation/' + user.email + '/' + activation.activationCode
    var mailOptions = {
        from: 'Grp1 <semprojectgrp1@gmail.com>', // sender address
        to: activation.email, // list of receivers
        subject: 'Account verification from grp1 Metasearch', // Subject line
        text: 'Account verification for grp1 metasearch', // plaintext body
        html: 'Hello ' + user.userName + '<br/>Please verify your account by clicking this link <a href="' + url + '">Verify account </a><br/>Or copy this url: ' + url
    };

// send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });


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

function _activateUser(activationCode, email, callback) {

    Activation.find({email: email, activationCode: activationCode}, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            if (result.length > 0) {
                User.update({email: email}, {
                    activated: true
                }, function (err, numAffected, rawResponse) {
                    if (numAffected.ok === numAffected.nModified && numAffected.ok === numAffected.n) {
                        callback({msg: "Your account is now activated"})
                    }
                    else {
                        callback({msg: "An error has occured"})
                    }
                })
            }
            else {
                callback({msg: "An error has occured"})
            }
        }
    })

}

function _validateLogin(username, password, callback) {

    User.findOne({userName: username}, function (err, result) {
        if (err) {
            callback(JSON.stringify({error: err.toString()}), null);
        }
        else {

            if (result) {
                bcrypt.compare(password, result.pw, function (err, res) {

                    if (res) {
                        // This must have been a fault??
                        //callback(result);
                        callback(null, result);
                    }
                    else {
                        callback(null);
                    }

                })
            }
            else {
                callback(null);
            }
        }
    })

}

module.exports = {

    createNewUser: _createNewUser,
    findAllUsers: _findAllUsers,
    activeUser: _activateUser,
    validateUser: _validateLogin

};

