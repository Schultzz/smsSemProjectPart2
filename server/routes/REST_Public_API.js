var express = require('express');
var router = express.Router();

var userFacade = require('../model/userFacade');

router.post('/', function (req, res) {

    var newUser = req.body;

    userFacade.createNewUser(newUser, function (err, result) {
        if (err) return res.send(err);
        res.send(result);
    });

});

router.get('/activation/:email/:activationCode', function (req, res) {

    var email = req.params.email;
    var activationCode = req.params.activationCode;
    userFacade.activeUser(activationCode, email, function (result) {

        response = "&lt;div class=&quot;alert alert-success&quot;&gt; &lt;a href=&quot;#&quot; class=&quot;close&quot; data-dismiss=&quot;alert&quot;&gt;&amp;times;&lt;/a&gt; &lt;strong&gt;Success!&lt;/strong&gt; Your message has been sent successfully. &lt;/div&gt; "

        var strVar = "";

        if (result.msg != "An error has occured") {

            strVar += "<html>";
            strVar += "<head>";
            strVar += "<link rel=\"stylesheet\" href=\"https:\/\/maxcdn.bootstrapcdn.com\/bootstrap\/3.3.4\/css\/bootstrap.min.css\">";
            strVar += "<\/head>";
            strVar += "<body>";
            strVar += "    <div class=\"alert alert-success\">";
            strVar += "        <a href=\"#\" class=\"close\" data-dismiss=\"alert\">&times;<\/a>";
            strVar += "        <strong>Success!<\/strong> " + result.msg + ".";
            strVar += "    <\/div>";
            strVar += "<\/body>";
            strVar += "<\/html>";

        }
        else{

            strVar += "<html>";
            strVar += "<head>";
            strVar += "<link rel=\"stylesheet\" href=\"https:\/\/maxcdn.bootstrapcdn.com\/bootstrap\/3.3.4\/css\/bootstrap.min.css\">";
            strVar += "<\/head>";
            strVar += "<body>";
            strVar += "    <div class=\"alert alert-danger\">";
            strVar += "        <a href=\"#\" class=\"close\" data-dismiss=\"alert\">&times;<\/a>";
            strVar += "        <strong>Error!<\/strong> " + result.msg + ".";
            strVar += "    <\/div>";
            strVar += "<\/body>";
            strVar += "<\/html>";
        }

        res.send(strVar);
    });

});

module.exports = router;