var db = require('./db');
var mongoose = require('mongoose');

var Promise = require("bluebird");
var Airline = mongoose.model('Airline');
var Order = mongoose.model("Order");
var User = mongoose.model("User");

var request = Promise.promisify(require("request"));

var getAirlineUrls = function () {
    return new Promise(function (resolve, reject) {

        Airline.find({}, function (err, res) {

            if (err) {
                reject(err);
            }

            resolve(res);

        });

    });

};

var getFlightsFromOtherAirlines = function (al, airport, date) {
    'use strict';

    var arrAirlinesUrls = [];

    al.forEach(function (elem) {

        var urlObj = {url: elem.url + "/api/flights/" + airport + "/" + date};

        arrAirlinesUrls.push(request(urlObj));
    });


    return new Promise(function (resolve, reject) {

        Promise.all(arrAirlinesUrls).then(function (results) {

            var arrAirlines = [];

            results.forEach(function (elem) {
                arrAirlines.push(elem[0].body);
            });
            console.log('all done with ' + results.length + ' queries');

            resolve(arrAirlines);
        });

    });
};

var _getAirlines = function (airport, date, callback) {
    'use strict';

    getAirlineUrls()
        .then(function (airlines) {
            return airlines;
        })
        .then(function (airlines) {
            return getFlightsFromOtherAirlines(airlines, airport, date);
        })
        .then(function (result) {
            //console.log("Result:", result);
            callback(result);
        });
};

var _makeReservation = function (airline, id, reservation, userId, callback) {

    Airline.findOne({airline: airline}, function (err, res) {

        if (err) {
            return console.log(err);
        }

        console.log(res.url);

        var url = res.url + "api/flights/" + id;

        var options = {
            method: 'post',
            body: reservation,
            json: true,
            url: url
        };

        request(options, function (error, response, body) {

            if (error) {
                return console.log(error);
            }

            console.log(body);

            var newOrder = new Order({
                reservationID: body.reservationID,
                flightID: body.flightID,
                passengers: body.Passengers,
                totalPrice: body.totalPrice,
                airline: res._id,
                user: userId
            });

            newOrder.save(function (err, data) {
                if (err) {
                    console.log(err);
                }
                console.log("data", data);
            });

        });


    });


};

//var passengerObj =
//{
//    "Passengers": [
//        {
//            "firstName": "Kong Hans123",
//            "lastName": "Hansen",
//            "city": "Lyngby",
//            "country": "Denmark",
//            "street": "Vejen"
//        }, {
//            "firstName": "Fisker123",
//            "lastName": "Hansen",
//            "city": "Lyngby",
//            "country": "Denmark",
//            "street": "Vejen"
//        }
//    ]
//};
////
//_makeReservation("Gruppe1", 6152, passengerObj, "5553ae2cd97cab94206b8288");

module.exports = {
    getAirlines: _getAirlines,
    makeReservation: _makeReservation
};

