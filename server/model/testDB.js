/**
 * Created by MS on 12-05-2015.
 */
var userFacade = require('./userFacade');

var user = {
    userName: "Ole",
    email: "Ole@unicom.dk",
    pw: "Hans"
};

//userFacade.createNewUser(user ,function (err, user) {
//
//    console.log("User: ",user);
//
//});

//
//userFacade.findAllUsers(function (err, data) {
//
//    console.log(data);
//
//});


//Add airlines.
//
//var mongoose = require('mongoose');
//var Airline = mongoose.model("Airline");
//
//var newAirline = new Airline({
//    airline: "Gruppe1",
//    url: "http://smsproject-schultz.rhcloud.com/smsSemProject/"
//});
//
//newAirline.save(function (err, airline) {
//    if (err) {
//        return res.end(JSON.stringify({error: err.toString()}));
//    }
//    else {
//       console.log(airline);
//    }
//});
//
//var newAirline = new Airline({
//    airline: "Gruppe3",
//    url: "http://semesterproject-testnikolai1.rhcloud.com/SemesterProjectFligths/"
//});
//
//newAirline.save(function (err, airline) {
//    if (err) {
//        return res.end(JSON.stringify({error: err.toString()}));
//    }
//    else {
//        console.log(airline);
//    }
//});
//
//var newAirline1 = new Airline({
//    airline: "Gruppe7",
//    url: "http://Airline7-team007.rhcloud.com/"
//});
//
//newAirline1.save(function (err, airline) {
//    if (err) {
//        return res.end(JSON.stringify({error: err.toString()}));
//    }
//    else {
//        console.log(airline);
//    }
//});


var mongoose = require ('mongoose');
//var User = mongoose.model("User");
var Order = mongoose.model("Order");
//
//var order = new Order({
//    email : "laks@gmail.com",
//    flightId : "lakslaks123",
//    airline : "Slyngel Airline",
//    passengers : [{firstName : "Morten", lastName : "pis", city : "Soborg", country : "Faggidistan", street : "Shawarma 1"}, {firstName : "Stefan", lastName : "pis", city : "Soborg", country : "Faggidistan", street : "Shawarma 2"}],
//    totalPrice : 1337
//});
//
//order.save(function (err, order) {
//
//    if(err){
//        return console.log(err);
//    }
//    else{
//        console.log(order);
//    }
//});



// ORDER TEST

Order.findOne({reservationID: 6985}).populate('user').populate('airline').exec(function(err, data) {
    console.log(data);
});