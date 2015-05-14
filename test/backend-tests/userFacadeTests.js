global.TEST_DATABASE = "mongodb://localhost/TestDataBase";

var db = require('../../server/model/db');
var mongoose = require('mongoose');
var nock = require('nock');
var should = require('should');

var userObject = require('./userArray');

var User = mongoose.model('User');
var userFacade = require('../../server/model/userFacade');

describe("UserFacade", function () {

    describe("createNewUser", function () {

        beforeEach(function (done) {
            User.remove({}, function () {
                userFacade.createNewUser(userObject, function (err, data) {
                    console.log(data);
                    done();
                });
            })
        });

        var user = {};

        it("", function () {




        })

    });

});