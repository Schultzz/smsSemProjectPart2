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

router.post('/activation/:email/:activationCode', function(req, res){



});

module.exports = router;