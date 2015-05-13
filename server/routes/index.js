var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var userFacade = require('../model/userFacade');

/* GET home page. */
router.get('/', function (req, res) {
    res.redirect("app/index.html")
});


router.post('/authenticate', function (req, res) {

    userFacade.validateUser(req.body.username, req.body.password, function (response) {

        if (response == null) {
            res.status(401).send('Wrong user or password');
            return;

        }
        else {
           if(response.role === "user"){

               if(response.activated){
               var token = jwt.sign(response, require("../security/secrets").secretTokenUser, { expiresInMinutes: 60*5 });
               res.json({ token: token });
               return;
               }
               else{
                   res.status(401).send('Please active your account by pressing the link send to your email');
                   return;
               }

           }
           else if(response.role === "admin"){

               var token = jwt.sign(response, require("../security/secrets").secretTokenAdmin, { expiresInMinutes: 60*5 });
               res.json({ token: token });
               return;
           }
            else{
               res.status(401).send('Wrong user or password');
               return;
           }
        }

    })


});


//Get Partials made as Views
router.get('/partials/:partialName', function (req, res) {
    var name = req.params.partialName;
    res.render('partials/' + name);
});

module.exports = router;
