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

var _makeReservation = function (airlineName, flightId, passengers, userId, callback) {

    Airline.findOne({airline: airlineName}, function (err, res) {

        if (err) {
            return console.log(err);
        }

        console.log(res.url);

        var url = res.url + "api/flights/" + flightId;

        var options = {
            method: 'post',
            body: passengers,
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
                    return console.log(err);
                }
                console.log("data", data);
                callback(data);
            });

        });


    });

};

var _getReservation = function (userId, callback) {

    Order.find({user: userId}).populate('user').populate('airline').exec(function (err, data) {
        if (err) return callback(err);

        var customerArray = [];

        data.forEach(function (elem) {
            var customerObject = {
                userName: elem.user.userName,
                reservationID: elem.reservationID,
                flightID: elem.flightID,
                airline: elem.airline.airline,
                totalPrice: elem.totalPrice,
                passengers: elem.passengers
            };
            customerArray.push(customerObject);
        });

        callback(null, customerArray);

    });

};

//_getReservation("555ce82889ad053c20604c7c", function (err, data) {
//    console.log(data);
//});

var passengerObj =
{
    "Passengers": [
        {
            "firstName": "Kong Hans123",
            "lastName": "Hansen",
            "city": "Lyngby",
            "country": "Denmark",
            "street": "Vejen"
        }, {
            "firstName": "Fisker123",
            "lastName": "Hansen",
            "city": "Lyngby",
            "country": "Denmark",
            "street": "Vejen"
        }
    ]
};

//_makeReservation("MLG airlines", 6152, passengerObj, "555ce82889ad053c20604c7c",function (data){
//
//});

module.exports = {
    getAirlines: _getAirlines,
    makeReservation: _makeReservation,
    getReservation: _getReservation
};

