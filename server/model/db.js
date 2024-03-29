var mongoose = require('mongoose');
/*

 Note:
 To this test project as it is:

 Start your MongoDB database.
 Start mongo.exe and do:
 use testdb
 db.testusers.insert({userName : "Lars", email :"lam@cphbusiness.dk",pw: "test",created : new Date()})
 db.testusers.insert({userName : "Henrik", email :"hsty@cphbusiness.dk",pw: "test",created : new Date()})
 db.testusers.insert({userName : "Tobias", email :"tog@cphbusiness.dk",pw: "test",created : new Date()})
 db.testusers.insert({userName : "Anders", email :"aka@cphbusiness.dk",pw: "test",created : new Date()})

 */
var dbURI;

//This is set by the backend tests
if (typeof global.TEST_DATABASE != "undefined") {
    dbURI = global.TEST_DATABASE;
}
else {
    //for openshift
    //  dbURI = 'mongodb://schultz:qwerty@ds063168.mongolab.com:63168/ms';

    dbURI = 'mongodb://localhost/testdb';
}

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function (err) {
    global.mongo_error = "Not Connected to the Database";
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});


/** User SCHEMA **/
/** Replace this Schema with your own(s) **/

var orderSchema = new mongoose.Schema({

    reservationID: String,
    flightID: String,
    passengers: [{firstName: String, lastName: String, city: String, country: String, street: String}],
    totalPrice: Number,
    airline: {type : mongoose.Schema.Types.ObjectId, ref: 'Airline'},
    user : {type : mongoose.Schema.Types.ObjectId, ref: 'User'}

});

var usersSchema = new mongoose.Schema({

    userName: String,
    email: {type: String, unique: true},
    pw: String,
    created: {type: Date, default: new Date()},
    activated: Boolean,
    role: String

});

var airlinesSchema = new mongoose.Schema({

    airline: String,
    url: String

});

var activationSchema = new mongoose.Schema({

    email: String,
    activationCode: String

});

mongoose.model('User', usersSchema);
mongoose.model('Airline', airlinesSchema);
mongoose.model('Activation', activationSchema);
mongoose.model('Order', orderSchema);

