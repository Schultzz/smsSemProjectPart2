var express = require('express');

var airlineFacade = require('../model/airlineFacade')

var router = express.Router();
router.get('/test', function(req, res) {
    res.header("Content-type","application/json");
    res.end('{"msg" : "Test Message fetched from the server, You are logged on as a User since you could fetch this data"}');
});


router.get('/flights/:startAirport/:date', function(req, res){

    var airportCode = req.params.startAirport;
    var flightDate = req.params.date;

    airlineFacade.getAirlines(airportCode, flightDate, function(result){
        res.header("Content-type","application/json");
        res.send(result);
    })

});

module.exports = router;
