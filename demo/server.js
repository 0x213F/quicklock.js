////////////////////////////////////////////////////////////////////////////////
// imports

var hash    = require('password-hash');
var express = require("express");
var path    = require("path");
var app     = express();

////////////////////////////////////////////////////////////////////////////////
// routes

app.get("/", function (req, res) {
    if(loggedin && !locked) {
        lasttime = new Date().getTime();
        res.status(200).sendFile(path.join(__dirname + "/home/index.html"));
    } else {
        res.status(200).sendFile(path.join(__dirname + "/login/index.html"));
    }
});

app.get("/login", function (req, res) {
    if(hash.verify(req.query.pass, pass) && req.query.user === user) {
        loggedin = true;
        locked = false;
        res.status(200).send();
    } else {
        res.status(401).send();
    }
});

app.get("/checkserver", function (req, res) {
    var curr = new Date().getTime();
    if(curr - lasttime > timeinterval + 500) {
        loggedin = false;
        locked = true;
        res.status(401).send();
    } else {
        lasttime = curr;
        res.status(200).send();
    }
});

app.get("/lock", function (req, res) {
    locked = true;
    attempts = 0;
    cookie = "";
    res.status(200).send();
});

app.get("/unlock", function (req, res) {
    if(!locked) {
        return;
    } else if(attempts >= allowedattempts-1) {
        loggedin = false;
        res.status(429).send();
    } else if(hash.verify(req.query.pin, pin)) {
        locked = false;
        res.status(200).send();
    } else {
        attempts++;
        res.status(401).send();
    }
});

app.use("/", express.static(__dirname));
app.use("/src", express.static(path.resolve(__dirname + "/../src")));

////////////////////////////////////////////////////////////////////////////////
// custom routes

app.get("/yourroutehere", function (req, res) {
    if(loggedin && !locked) {
        res.status(200).send();     // user is validated
    } else {
        res.status(401).send();     // user is not validated
    }
});

////////////////////////////////////////////////////////////////////////////////
// start server
app.listen(8080, function () {
    console.log("server listening on port 8080");
});

////////////////////////////////////////////////////////////////////////////////
// main

var locked = false,
    loggedin = false,
    attempts,
    user = process.argv[2],
    pass = hash.generate(process.argv[3]),
    pin = hash.generate(process.argv[4]),
    allowedattempts = process.argv[5],
    timeinterval = process.argv[6],
    lasttime;
