const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const url = require('url');
const fs = require('fs');
const nizMjeseci = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'August', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];
const db = require('./db.js');

app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/../'));
app.use('/', express.static(__dirname));

app.get('/osobe.html', function (req, res) {

    res.sendFile(path.join(__dirname, '../html/osobe.html'));

});
// #region Inicijalizacija Baze
/*db.sequelize.sync().then(function(){
    init();
});      */

function init() {
     //formiram listu osoblja
       db.osoblje.create({ime:'Neko', prezime:'Nekić', uloga:'profesor'});
      db.osoblje.create({ime:'Drugi', prezime:'Neko', uloga:'asistent'});
      db.osoblje.create({ime:'Test', prezime:'Test', uloga:'asistent'});
       //formiram listu termina
      db.termin.create({redovni:false, dan:null, datum:'01.01.2019.', semestar:null, pocetak:'12:00' , kraj:"13:00"});
      db.termin.create({redovni:true, dan:0, datum:null, semestar:'zimski', pocetak:'13:00' , kraj:"14:00"});
       //formiram listu sala
       db.sala.create({naziv:"VA1", zaduzenaOsoba:1});
       db.sala.create({naziv:"MA", zaduzenaOsoba:2});
       db.sala.create({naziv:"VA2", zaduzenaOsoba:1});
       db.sala.create({naziv:"0-01", zaduzenaOsoba:2});
       db.sala.create({naziv:"0-02", zaduzenaOsoba:3});
       db.sala.create({naziv:"0-03", zaduzenaOsoba:2});
       db.sala.create({naziv:"0-04", zaduzenaOsoba:1});
       db.sala.create({naziv:"0-05", zaduzenaOsoba:3});
       db.sala.create({naziv:"0-06", zaduzenaOsoba:1});
       db.sala.create({naziv:"0-07", zaduzenaOsoba:2});
       db.sala.create({naziv:"0-08", zaduzenaOsoba:1});
       db.sala.create({naziv:"0-09", zaduzenaOsoba:3});
       db.sala.create({naziv:"1-01", zaduzenaOsoba:3});
       db.sala.create({naziv:"1-02", zaduzenaOsoba:1});
       db.sala.create({naziv:"1-03", zaduzenaOsoba:3});
       db.sala.create({naziv:"1-04", zaduzenaOsoba:1});
       db.sala.create({naziv:"1-05", zaduzenaOsoba:2});
       db.sala.create({naziv:"1-06", zaduzenaOsoba:3});
       db.sala.create({naziv:"1-07", zaduzenaOsoba:2});
       db.sala.create({naziv:"1-08", zaduzenaOsoba:1});
       db.sala.create({naziv:"1-09", zaduzenaOsoba:3}); 


       db.rezervacija.create({terminFK:1 , salaFK:1, osoba:1});
       db.rezervacija.create({terminFK:2, salaFK:2 , osoba:3});
}
// #endregion


// #region Spirala 4, Zadatak 1 
app.get ('/osoblje' , function (req, res) {
  db.osoblje.findAll({ attributes: ['ime', 'prezime', 'uloga']}).then(function(users) {
      res.json(users);
    });
 });

 app.get('/baza_zauzeca',function (req, res) {
   //preuzimamo sve podatke (join svih tabela)
   let odgovor ={};
   db.rezervacija.findAll({
     include: [
         {
             model: db.termin,
             as: 'termin'
         },
        {
             model: db.sala,
             as: 'sala'
         },
         {
             model: db.osoblje
         } 
     ]
   }).then (function(lista){
       let periodicnaList = [] , vanrednaList=[];
       //sortiramo zauzeća
       lista.forEach(function(zauzece){
            let predavac = zauzece.osoblje.ime + " " + zauzece.osoblje.prezime;
            if (zauzece.termin.redovni) {
            periodicnaList.push ({dan: zauzece.termin.dan , semestar:zauzece.termin.semestar, pocetak: zauzece.termin.pocetak,
            kraj: zauzece.termin.kraj , naziv: zauzece.sala.naziv, predavac: predavac, uloga: zauzece.osoblje.uloga });
            }
            else {
            vanrednaList.push({datum: zauzece.termin.datum ,pocetak: zauzece.termin.pocetak,
                kraj: zauzece.termin.kraj,  naziv: zauzece.sala.naziv, predavac: predavac ,uloga: zauzece.osoblje.uloga  });
            }
       });
   
       odgovor["periodicna"]= periodicnaList;
       odgovor["vanredna"] = vanrednaList;
       res.json(odgovor);
      
   });
});
// #endregion


// #region Spirala 4, zadatak 2
function vratiResponse (res, response) {
    res.json(response);
}
function dodajZauzeceUBazu (zauzece, resp) {
    let idTermina=0 , idOsobe= 0, idSale=0;
   let imePrezimeArray = zauzece["predavac"].split(" ");
   
   if (zauzece["periodic"])  
   terminInstance= {redovni:true , dan: zauzece["dan"], datum: null , semestar: zauzece["semestar"], pocetak: zauzece["pocetak"], kraj: zauzece["kraj"]};
   else 
   terminInstance = {redovni:false , dan: null, datum: zauzece["datum"] , semestar: null, pocetak: zauzece["pocetak"], kraj: zauzece["kraj"]};
  
   db.termin.create(terminInstance).then(terminData => {
       idTermina=terminData.dataValues.id;
       db.osoblje.findOne({where:{
          ime: imePrezimeArray[0] , prezime: imePrezimeArray[1], uloga: zauzece["uloga"]
         }}).then(osobljeData => {
           idOsobe= osobljeData.dataValues.id;
           db.sala.findOne({
               where: {naziv: zauzece["naziv"]}
           }).then(salaData => {
               idSale= salaData.dataValues.id;
               db.rezervacija.create({
                   terminFK: idTermina , osoba: idOsobe, salaFK: idSale
               }).then(function(data){
                    vratiResponse(resp,zauzece);  
               });
           });
         });
   });
}
// #endregion
   
   
 // #region Spirala 3
app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname, '../html/pocetna.html'));
});

app.get('/pocetna.html', function (req, res) {

    res.sendFile(path.join(__dirname, '../html/pocetna.html'));

});


//Path za slanje jedne slike sa servera
app.get('/slike/:nazivSlike', function (req, res) {
     let nazivSlike = req.params["nazivSlike"];
     let fajlPath = '../img/' + nazivSlike;
    // console.log(fajlPath);
    if (!(fs.existsSync(fajlPath))) throw "Greška odabrana slika ne postoji ";
   res.sendFile(path.join(__dirname, '../img/' + nazivSlike));

});



app.post('/slike', function (req, res) {
    let jsonResponse = req.body, listURL = [];

    if (!(jsonResponse.hasOwnProperty('firstLoad'))) {
        let novaVelicina =0;
        fs.readdir('../img', (err, files) => {
            files.forEach(file => {
                novaVelicina++;
            });
        res.json({ novaVelicina:novaVelicina });
        });
        
    }
    else if (jsonResponse["firstLoad"]) {
        let i = 0, ptr = 0;
        fs.readdir('../img', (err, files) => {
            files.forEach(file => {
                if (i < 3) {
                    ptr = i + 1;
                    listURL.push({ slika: "../img/" + file });
                }
                i++;
            });
            globalPointer=0;
        
            res.json({ listURL: listURL, ptr: ptr, velicina: i });
        });
    }
    else {
   
        let ptr = jsonResponse["ptr"], vel = jsonResponse["velicina"];
        let limit = ptr + 2, i = 0, newPtr = ptr;
        fs.readdir('../img', (err, files) => {
            files.forEach(file => {
                if (i >= ptr && i <= limit) {
                    listURL.push({ slika: "../img/" + file });
                    newPtr++;
                }
                i++;
                if (i == limit) return;
            });
            res.json({ listURL: listURL, ptr: newPtr });
        });
    }

});

app.get('/zauzeca.json', function (req, res) {
    res.sendFile(path.join(__dirname, '../json/zauzeca.json'));
});

app.get('/rezervacija.html', function (req, res) {
    res.sendFile(path.join(__dirname, '../html/rezervacija.html'));
});

app.get('/sale.html', function (req, res) {
    res.sendFile(path.join(__dirname, '../html/sale.html'));
});

app.get('/unos.html', function (req, res) {
    res.sendFile(path.join(__dirname, '../html/unos.html'));
});

var _res, _jr;


app.post('/rezervacija.html', function (req, res) {

    
    let jsonResponse = provjeriZauzeca(req.body);
    console.log("Kod rezervacije termina" + JSON.stringify(req.body));
    if (!(jsonResponse["valid"])) {
      jsonResponse["stringDatuma"] = jsonResponse["stringDatuma"].replace('.', '/'); 
      jsonResponse["stringDatuma"] = jsonResponse["stringDatuma"].replace('.', '/'); 
        if (jsonResponse["stringDatuma"] != "") {
            jsonResponse["alert"] = "Nije moguće rezervisati salu " + req.body["opcija"] + " za navedeni datum " + jsonResponse["stringDatuma"].replace('.', ' ') + " i termin od " + req.body["pocetak"] + " do " + req.body["kraj"] + "!";
            jsonResponse["alert"] += "(Zahtjev za zauzece poslao " + jsonResponse["uloga"] + " " + jsonResponse["predavac"];}
        else {
            let strv= "Nije moguće rezervisati salu " + req.body["opcija"] + " za navedeni datum " + jsonResponse["stringDatuma"].replace('.', ' ') + " i termin od " + req.body["pocetak"] + " do " + req.body["kraj"] + "!";
            jsonResponse["alert"] = strv + "\n (Nije moguće praviti periodične rezervacije u periodu van zimskog ili ljetnog semestra!)";
            jsonResponse["alert"] += "(Zahtjev za zauzece poslao " + jsonResponse["uloga"] + " " + jsonResponse["predavac"];
        }
        res.json(jsonResponse);
    }
    else {
       
       
      dodajZauzeceUBazu(jsonResponse, res);
      //azurirajBazu
    }
   
  });



function azurirajJSON(js_respa) {
    fs.readFile('../json/zauzeca.json', 'utf8', function (errx, data) {
        if (errx) throw errx;
        let obj = JSON.parse(data);
        obj.periodicna = js_respa["periodicnaZauzeca"];
        obj.vanredna = js_respa["vanrednaZauzeca"];

        fs.writeFile("../json/zauzeca.json", JSON.stringify(obj), function (err) {
            if (err) {
                throw err;
            }
        });
    });
}

function provjeriSemestar(trenutniMjesec) {

    for (let i = 1; i <= 5; i++)
        if (trenutniMjesec == nizMjeseci[i]) {
            return "ljetni";
        }
    if  (trenutniMjesec == nizMjeseci[0]) return "zimski";
    for (let i = 9; i <= 11; i++)
        if (trenutniMjesec == nizMjeseci[i]) {
            return "zimski";
        }
    return null;
}

function preklapanjeTermina(poc, kr, pocetak, kraj) {
    if ((poc >= pocetak && poc < kraj) || (kr > pocetak && kr <= kraj) || (poc <= pocetak && kr >= kraj)) return true;
    return false;
}
function vratiPeriodDatuma(dateStr) {
    let arr = dateStr.split(".");
    // return arr[0];
    let mjesec = parseInt(arr[1], 10), dan = parseInt(arr[0], 10);

    mjesec--;
    let datr = new Date(2019, mjesec, dan);
    let val = datr.getDay() - 1;
    if (val == -1) val = 6;
    return val;

}

function vratiSemestarIzBrojaMjeseca(mj) {
    let arr = mj.split(".");
    let br = parseInt(arr[1]) - 1;
    return (br <= 5 && br!=0) ? "ljetni" : "zimski";
}
function provjeriZauzeca(podaci) {
    let periodicnaZauzeca = podaci["periodicna"], vanrednaZauzeca = podaci["vanredna"];
    let datum = new Date(2019, nizMjeseci.indexOf(podaci["trenutniMjesec"]), ++podaci["odabraniDan"]);
    let periodicniDan = datum.getDay() - 2, tipSemestra = provjeriSemestar(podaci["trenutniMjesec"]), mon = nizMjeseci.indexOf(podaci["trenutniMjesec"]) + 1;
    let odabraniDan = podaci["odabraniDan"] - 1;
    //način kako je specificirano oznacavanje dana u spirali 2 je nekonzistentno sa Date tipom u JS-u
    if (periodicniDan == -2) periodicniDan = 5;
    else if (periodicniDan == -1) periodicniDan = 6;

    if (tipSemestra == null && (podaci["periodicnost"])) return { valid: false, stringDatuma: "" , predavac: podaci["predavac"] , uloga: podaci["uloga"] };

    let stringDana = (odabraniDan < 10 ? "0" : "") + odabraniDan, stringMjeseca = (mon < 10 ? "0" : "") + mon;
    let stringDatuma = stringDana + "." + stringMjeseca + ".2019.";
    //provjera periodicnih zauzeca
    for (let i = 0; i < periodicnaZauzeca.length; i++) {
        if (tipSemestra == periodicnaZauzeca[i]["semestar"] && podaci["opcija"] == periodicnaZauzeca[i]["naziv"]
            && periodicniDan == periodicnaZauzeca[i]["dan"] &&
            preklapanjeTermina(periodicnaZauzeca[i]["pocetak"], periodicnaZauzeca[i]["kraj"], podaci["pocetak"], podaci["kraj"])) {
          
            return { valid: false, stringDatuma: stringDatuma , predavac: podaci["predavac"] , uloga: podaci["uloga"] };
        }
    }


    //provjera vanrednih zauzeca
    for (let i = 0; i < vanrednaZauzeca.length; i++) {

        let semestarMjeseca = vratiSemestarIzBrojaMjeseca(vanrednaZauzeca[i]["datum"]);

        if (podaci["opcija"] == vanrednaZauzeca[i]["naziv"] && preklapanjeTermina(vanrednaZauzeca[i]["pocetak"], vanrednaZauzeca[i]["kraj"], podaci["pocetak"], podaci["kraj"])
            && (stringDatuma == vanrednaZauzeca[i]["datum"] || (podaci["periodicnost"] == true && vratiPeriodDatuma(vanrednaZauzeca[i]["datum"]) == periodicniDan && semestarMjeseca == tipSemestra)
            )) {

            return { valid: false, stringDatuma: stringDatuma ,  predavac: podaci["predavac"] , uloga: podaci["uloga"] };
        }
    }

    if (podaci["periodicnost"] == true) {
        return { valid: true ,dan: periodicniDan, semestar: tipSemestra, pocetak: podaci["pocetak"], kraj: podaci["kraj"], naziv: podaci["opcija"],  predavac: podaci["predavac"] , uloga: podaci["uloga"] , periodic: true };
      
    }
     return { valid: true , datum: stringDatuma, pocetak: podaci["pocetak"], kraj: podaci["kraj"], naziv: podaci["opcija"],  predavac: podaci["predavac"] , uloga: podaci["uloga"] , periodic:false }; 
}
app.listen(8080);
// #endregion


