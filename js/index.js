const express = require('express');
const bodyParser = require ('body-parser');
const app = express();
const path= require('path');
const url = require('url');
const fs = require('fs');

app.use( '/',express.static(__dirname + '/../'));
app.use( '/',express.static(__dirname));

app.get ('/' , function (req, res) {
    res.sendFile(path.join(__dirname, '../html/pocetna.html'));
});

app.get ('/pocetna' , function (req, res) {
    res.sendFile(path.join(__dirname, '../html/pocetna.html'));
});

app.get ('/rezervacija' , function (req, res) {
    res.sendFile(path.join(__dirname, '../html/rezervacija.html'));
});

app.get ('/sale' , function (req, res) {
    res.sendFile(path.join(__dirname, '../html/sale.html'));
});

app.get ('/unos' , function (req, res) {
    res.sendFile(path.join(__dirname, '../html/unos.html'));
});

app.post ('/rezervacija', function(req, res) {
    console.log("saljemo podatke");
}); 

app.listen(8080);