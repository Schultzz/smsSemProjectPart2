var db = require('./db');
var mongoose = require('mongoose');

var Promise = require("bluebird");
var Airline = mongoose.model('Airline');
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
}

module.exports = {
    getAirlines: _getAirlines
};

