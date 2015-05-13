var express = require('express');
var router = express.Router();

var userFacade = require('../model/userFacade');

router.post('/', function(req, res){

    var newUser = req.body;

    userFacade.createNewUser(newUser, function(err, result){
        if(err) return res.send(err);
        res.send(result);
    });

});

router.get('/activation/:email/:activationCode', function(req, res){

    var email = req.params.email;
    var activationCode = req.params.activationCode;
    userFacade.activeUser(activationCode, email, function(result){
        res.send(result);
    });

});

module.exports = router;