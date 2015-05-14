/**
 * Created by MS on 13-05-2015.
 */
global.TEST_DATABASE = "mongodb://localhost/TestDataBase";

var db = require('../../server/model/db');
var mongoose = require('mongoose');
var nock = require('nock');
var should = require('should');

var airlineArray = require('./airlineArray');

var Airline = mongoose.model('Airline');
var airlineFacade = require('../../server/model/airlineFacade');


describe("airlineFacade", function () {

    describe("getAirlines", function () {

        before(function (done) {
            Airline.remove({}, function () {
                Airline.create(airlineArray, function (err) {

                    Airline.find({}, 'url', function (err, data) {
                        data.forEach(function (elem) {
                            nock(elem.url)
                                .get("/api/flights/CPH/123456789")
                                .reply(200, {"Airline": "AirlineTEST"})
                        });
                        done();
                    })

                });
            });


        });


        it("should return the mocked values from all the urls in the database", function(done){
        airlineFacade.getAirlines("CPH", "123456789", function(data){

            data.should.length(2);

            var airline = JSON.parse(data[0]);

            airline.Airline.should.equal("AirlineTEST");

            done();
        })

        });


    })


});
