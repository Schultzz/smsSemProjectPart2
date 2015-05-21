var express = require('express');

var airlineFacade = require('../model/airlineFacade');

var router = express.Router();
router.get('/test', function (req, res) {
    res.header("Content-type", "application/json");
    res.end('{"msg" : "Test Message fetched from the server, You are logged on as a User since you could fetch this data"}');
});


router.get('/flights/:startAirport/:date', function (req, res) {

    var airportCode = req.params.startAirport;
    var flightDate = req.params.date;

    airlineFacade.getAirlines(airportCode, flightDate, function (result) {
        res.header("Content-type", "application/json");
        res.send(result);
    })

});


router.post('/reservation/:airline/:flightid/:user', function (req, res) {
    var flightID = req.params.flightid;
    var reservation = req.body;
    var user = req.params.user;
    var airline = req.params.airline;

    console.log(flightID, reservation, user, airline);

    airlineFacade.makeReservation(airline, flightID, reservation, user, function (data) {
        res.send(data);
    });

});

router.get('/reservation/:userId', function (req, res) {

    var userId = req.params.userId;

    airlineFacade.getReservation(userId, function (err, data) {
        if (err) {
            return res.end(JSON.stringify({error: err.toString()}))
        }
        res.send(data);
    })


});

module.exports = router;
