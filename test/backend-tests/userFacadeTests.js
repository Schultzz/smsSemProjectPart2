global.TEST_DATABASE = "mongodb://localhost/TestDataBase";
global.DEACTIVATE_EMAIL_SYSTEM = true;

var db = require('../../server/model/db');
var mongoose = require('mongoose');
var nock = require('nock');
var should = require('should');

var userObject = require('./userObject');

var User = mongoose.model('User');
var userFacade = require('../../server/model/userFacade');

describe("UserFacade", function () {


    describe("createNewUser", function () {

        beforeEach(function (done) {
            User.remove({}, function (err) {

                done();
            })
        });

        it("should add a user to the Database and encrypt the users password", function (done) {

            userFacade.createNewUser(userObject, function (err, data) {

                var createdUser = JSON.parse(data);

                createdUser.userName.should.equal("Hans");

                createdUser.email.should.equal("test@test.dk");

                createdUser.pw.should.not.equal("test");

                done();
            });


        })

    });

    describe("_findAllUsers", function () {

        before(function (done) {
            User.remove({}, function (err) {
                userFacade.createNewUser(userObject, function (err, data) {
                    done();
                });
            })
        });

        it("should find all stored users", function (done) {

            userFacade.findAllUsers(function (err, users) {

                users.should.length(1);

                users[0].userName.should.equal("Hans");
                users[0].email.should.equal("test@test.dk");

                done();

            })

        });
    });

    describe("_validateLogin", function(){

        before(function (done) {
            User.remove({}, function (err) {
                userFacade.createNewUser(userObject, function (err, data) {
                    done();
                });
            })
        });

        it("should validate a users password ", function(done){

            userFacade.validateUser("Hans", "test", function(err, validation){

                validation.should.not.equal("undefined");

                validation.email.should.equal("test@test.dk");

                done();
            });



        });

    });


});