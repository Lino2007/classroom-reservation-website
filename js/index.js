const express = require('express');
const bodyParser = require ('body-parser');
const app = express();
const path= require('path');
const url = require('url');
const fs = require('fs');
const nizMjeseci = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'August', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];

app.use(bodyParser.json());
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
   provjeriZauzeca (req.body);

 // Kalendar.ucitajPodatke();

}); 

function provjeriSemestar (trenutniMjesec) {
    let ljetni=false, zimski=false;
    for (let i = 1; i <= 5; i++)
    if (trenutniMjesec == nizMjeseci[i]) {
        return "ljetni";
    } 
  
  for (let i = 9; i <= 11; i++)
      if (trenutniMjesec == nizMjeseci[i] || trenutniMjesec == nizMjeseci[0]) {
         return "zimski";
      }
   
    return null;
}

function preklapanjeTermina(poc, kr, pocetak, kraj) {
   // console.log( poc + "|||"  + kr + "|*|" + pocetak + "|||" + kraj);
    if ((poc >= pocetak && poc < kraj) || (kr > pocetak && kr <= kraj) || (poc <= pocetak && kr >= kraj))  return true;
     return false;
  }

function provjeriZauzeca (podaci) {
      let periodicnaZauzeca= podaci["periodicna"], vanrednaZauzeca= podaci["vanredna"];
      let datum = new Date (2019, nizMjeseci.indexOf(podaci["trenutniMjesec"]), ++podaci["odabraniDan"]) ;
      let periodicniDan = datum.getDay() -2, tipSemestra = provjeriSemestar(podaci["trenutniMjesec"]), mon =nizMjeseci.indexOf(podaci["trenutniMjesec"]) +1;
      let odabraniDan =  podaci["odabraniDan"] -1;
      //način kako je specificirano oznacavanje dana u spirali 2 je nekonzistentno sa Date tipom u JS-u
      if (periodicniDan==-2) periodicniDan=5;
       else if (periodicniDan==-1) periodicniDan=6;
      
      if (tipSemestra==null) return ;

      //provjera periodicnih zauzeca
      for (let i =0 ; i<periodicnaZauzeca.length ; i++) {
         if (tipSemestra== periodicnaZauzeca[i]["semestar"] && periodicniDan==periodicnaZauzeca[i]["dan"] && 
         preklapanjeTermina(periodicnaZauzeca[i]["pocetak"],periodicnaZauzeca[i]["kraj"], podaci["pocetak"], podaci["kraj"]) && podaci["opcija"]==periodicnaZauzeca[i]["naziv"]) {
            console.log("Neispunjenje uslova bacamo error!");
         }
      }
      let stringDana = (odabraniDan < 10 ? "0" : "") + odabraniDan, stringMjeseca = (mon< 10 ? "0" : "") + mon;
      let stringDatuma = stringDana + "." + stringMjeseca + ".2019."; 
    
      //provjera vanrednih zauzeca
     for (let i =0 ; i<vanrednaZauzeca.length ; i++) {
        if (podaci["opcija"]==vanrednaZauzeca[i]["naziv"] && stringDatuma==vanrednaZauzeca[i]["datum"] && 
        preklapanjeTermina(vanrednaZauzeca[i]["pocetak"],vanrednaZauzeca[i]["kraj"], podaci["pocetak"], podaci["kraj"]) ) {
           console.log("Neispunjenje uslova bacamo error!");
        }
     } 
}

app.listen(8080);