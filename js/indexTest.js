/*-----------------
Kopija index.js za testiranje, uklonjen je samo region punjenja/inicijalizacije baze jer ne prolazi jedan test kada se paralelno puni baza i izvrsavaju testovi.
Prije pokretanja testova potrebno je pokrenuti komandu "node index.js" da se neometano popuni baza (sacekati notifikaciju da je baza popunjena), a zatim "npm test".
------------------*/
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


// #region Pomocne metode
    
function provjeriSemestar(trenutniMjesec) {
    //provjera na osnovu naziva semestra
    for (let i = 1; i <= 5; i++)
        if (trenutniMjesec == nizMjeseci[i]) {
            return "ljetni";
        }
    if (trenutniMjesec == nizMjeseci[0]) return "zimski";
    for (let i = 9; i <= 11; i++)
        if (trenutniMjesec == nizMjeseci[i]) {
            return "zimski";
        }
    return null;
}

function numerickaProvjeraSemestra(brojMjeseca) {
    //provjera na osnovu broja mjeseca
    if (brojMjeseca == 0 || brojMjeseca >= 9) return "zimski";
    else if (brojMjeseca >= 1 && brojMjeseca <= 5) return "ljetni";
    return "nijeSemestar";
}

function preklapanjeTermina(poc, kr, pocetak, kraj) {
    if ((poc >= pocetak && poc < kraj) || (kr > pocetak && kr <= kraj) || (poc <= pocetak && kr >= kraj)) return true;
    return false;
}


function vratiPeriodDatuma(dateStr) {
    //vraca periodicni dan na osnovu datuma
    let arr = dateStr.split(".");
    let mjesec = parseInt(arr[1], 10), dan = parseInt(arr[0], 10);
    mjesec--;
    let datr = new Date(2020, mjesec, dan);
    let val = datr.getDay() - 1;
    if (val == -1) val = 6;
    return val;
}

function vratiSemestarIzDatuma(mj) {
    //provjera semestra iz datuma formata dd.mm.yyyy.
    let arr = mj.split(".");
    let br = parseInt(arr[1]) - 1;
    return (br <= 5 && br != 0) ? "ljetni" : "zimski";
}
function preklapanjeTrenutnogVremenaITermina(poc, kr, trenutnoVrijeme) {
    console.log("pocetak: " + poc + " kraj: " + kr + "Trenutno vrijeme: " + trenutnoVrijeme);
    console.log("trenutnoVrijeme >= poc: ");
    console.log(trenutnoVrijeme >= poc);
    console.log("trenutnoVrijeme <= kr: ");
    console.log(trenutnoVrijeme <= kr);

    return (trenutnoVrijeme >= poc && trenutnoVrijeme <= kr);
}

// #endregion


// #region Spirala 4, Zadatak 1 

app.get('/osoblje', function (req, res) {
    db.Osoblje.findAll({ attributes: ['ime', 'prezime', 'uloga'] }).then(function (users) {
        res.json(users);
    });
});

app.get('/sale', function (req, res) {
    db.Sala.findAll({ attributes: ['naziv'] }).then(function (sale) {
        res.json(sale);
    });
});

// #endregion


// #region Spirala 4, zadatak 2

app.get('/zauzeca', function (req, res) {
    //preuzimamo sve podatke (join svih tabela)
    let odgovor = {};

    db.Rezervacija.findAll({
        include: [
            {
                model: db.Sala,
                as: "salaAssociation"
            },
            {
                model: db.Osoblje
            },
            {
                model: db.Termin,
                as: "terminAssociation"
            }
        ]
    }).then(function (lista) {
        let periodicnaList = [], vanrednaList = [];
        //sortiramo zauzeća
        lista.forEach(function (zauzece) {
            let predavac = zauzece.Osoblje.ime + " " + zauzece.Osoblje.prezime;
            if (zauzece.terminAssociation.redovni) {
                periodicnaList.push({
                    dan: zauzece.terminAssociation.dan, semestar: zauzece.terminAssociation.semestar, pocetak: zauzece.terminAssociation.pocetak,
                    kraj: zauzece.terminAssociation.kraj, naziv: zauzece.salaAssociation.naziv, predavac: predavac, uloga: zauzece.Osoblje.uloga
                });
            }
            else {
                vanrednaList.push({
                    datum: zauzece.terminAssociation.datum, pocetak: zauzece.terminAssociation.pocetak,
                    kraj: zauzece.terminAssociation.kraj, naziv: zauzece.salaAssociation.naziv, predavac: predavac, uloga: zauzece.Osoblje.uloga
                });
            }
        });

        odgovor["periodicna"] = periodicnaList;
        odgovor["vanredna"] = vanrednaList;
        res.json(odgovor);

    });
});

function vratiResponse(res, response) {
    res.json(response);
}
function dodajZauzeceUBazu(zauzece, resp) {
    let idTermina = 0, idOsobe = 0, idSale = 0;
    let imePrezimeArray = zauzece["predavac"].split(" ");

    if (zauzece["periodic"])
        terminInstance = { redovni: true, dan: zauzece["dan"], datum: null, semestar: zauzece["semestar"], pocetak: zauzece["pocetak"], kraj: zauzece["kraj"] };
    else
        terminInstance = { redovni: false, dan: null, datum: zauzece["datum"], semestar: null, pocetak: zauzece["pocetak"], kraj: zauzece["kraj"] };

    db.Termin.create(terminInstance).then(terminData => {
        idTermina = terminData.dataValues.id;
      

        db.Osoblje.findOne({
            where: {
                ime: imePrezimeArray[0], prezime: imePrezimeArray[1], uloga: zauzece["uloga"]
            }
        }).then(osobljeData => {
           
            idOsobe = osobljeData.dataValues.id;
            db.Sala.findOne({
                where: { naziv: zauzece["naziv"] }
            }).then(salaData => {
                idSale = salaData.dataValues.id;
                db.Rezervacija.create({
                    termin: idTermina, osoba: idOsobe, sala: idSale
                }).then(function (data) {
                    vratiResponse(resp, zauzece);
                });
            });
        });
    });
}

app.post('/rezervacija', function (req, res) {

    db.Rezervacija.findAll({
        include: [ {model: db.Sala,  as: "salaAssociation" },
            { model: db.Osoblje},
            { model: db.Termin,as: "terminAssociation"}
        ]
    }).then(function (lista) {
        let periodicnaList = [], vanrednaList = [];
        lista.forEach(function (zauzece) {
            let predavac = zauzece.Osoblje.ime + " " + zauzece.Osoblje.prezime;
            if (zauzece.terminAssociation.redovni) {
                periodicnaList.push({
                    dan: zauzece.terminAssociation.dan, semestar: zauzece.terminAssociation.semestar, pocetak: zauzece.terminAssociation.pocetak,
                    kraj: zauzece.terminAssociation.kraj, naziv: zauzece.salaAssociation.naziv, predavac: predavac, uloga: zauzece.Osoblje.uloga
                });
            }
            else {
                vanrednaList.push({
                    datum: zauzece.terminAssociation.datum, pocetak: zauzece.terminAssociation.pocetak,
                    kraj: zauzece.terminAssociation.kraj, naziv: zauzece.salaAssociation.naziv, predavac: predavac, uloga: zauzece.Osoblje.uloga
                });
            }
        });
       
        req.body["periodicna"] = periodicnaList;
      
        req.body["vanredna"] = vanrednaList;
        let jsonResponse = provjeriZauzeca(req.body);
    if (!(jsonResponse["valid"])) {
        jsonResponse["stringDatuma"] = jsonResponse["stringDatuma"].replace('.', '/');
        jsonResponse["stringDatuma"] = jsonResponse["stringDatuma"].replace('.', '/');
        if (jsonResponse["stringDatuma"] != "") {
            jsonResponse["alert"] = "Nije moguće rezervisati salu " + req.body["opcija"] + " za navedeni datum " + jsonResponse["stringDatuma"].replace('.', ' ') + " i termin od " + req.body["pocetak"] + " do " + req.body["kraj"] + "!";
            jsonResponse["alert"] += "\n(Zahtjev za zauzece poslao " + jsonResponse["uloga"] + " " + jsonResponse["predavac"] + ")";
        }
        else {
            let strv = "Nije moguće rezervisati salu " + req.body["opcija"] + " za navedeni datum " + jsonResponse["stringDatuma"].replace('.', ' ') + " i termin od " + req.body["pocetak"] + " do " + req.body["kraj"] + "!";
            jsonResponse["alert"] = strv + "\n (Nije moguće praviti periodične rezervacije u periodu van zimskog ili ljetnog semestra!)";
            jsonResponse["alert"] += "\n(Zahtjev za zauzece poslao " + jsonResponse["uloga"] + " " + jsonResponse["predavac"] + ")";
        }
        res.json(jsonResponse);
    }
    else {
        dodajZauzeceUBazu(jsonResponse, res);
    }
});
});


// #endregion


// #region Spirala 4, Zadatak 3

app.get('/osobe.html', function (req, res) {
    res.sendFile(path.join(__dirname, '../html/osobe.html'));
});

app.get('/osoblje_lokacija', function (req, res) {
    let dat = new Date(), osobljeLokacija = [];
    let stringVremena = dat.getHours() + ":" + dat.getMinutes() + ":" + dat.getSeconds();
    let periodicniDan = dat.getDay() - 1, mjesecTrenutni = dat.getMonth() + 1, dateString = ((dat.getDate() >= 10) ? "" : "0") + dat.getDate();
    let mjesecTrenutniString = ((mjesecTrenutni >= 10) ? "" : "0") + mjesecTrenutni, strSemestra = numerickaProvjeraSemestra(mjesecTrenutni - 1);
    let datumStr = dateString + "." + mjesecTrenutniString + ".2020.";
    if (periodicniDan == -1) periodicniDan = 6; //jer je u spirali ponedjeljak 0 (u js je ponedjeljak 1)
    console.log(stringVremena + "********");
    db.Osoblje.findAll({ attributes: ['ime', 'prezime', 'uloga'] }).then(function (listaOsoblja) {
        db.Rezervacija.findAll({
            include: [{ model: db.Sala, as: "salaAssociation" }, { model: db.Osoblje }, { model: db.Termin, as: "terminAssociation" }]
        }).then(function (listaRezervacija) {
            let redFlag = true;
            listaOsoblja.forEach(osoba => {
                for (let i = 0; i < listaRezervacija.length; i++) {
                    let zauzece = listaRezervacija[i];
                    if (osoba.ime == zauzece.Osoblje.ime && osoba.prezime == zauzece.Osoblje.prezime && osoba.uloga == zauzece.Osoblje.uloga) {
                        if (zauzece.terminAssociation.redovni && strSemestra != "nijeSemestar" && strSemestra == zauzece.terminAssociation.semestar
                            && periodicniDan == zauzece.terminAssociation.dan && preklapanjeTrenutnogVremenaITermina(zauzece.terminAssociation.pocetak, zauzece.terminAssociation.kraj, stringVremena)) {
                            osobljeLokacija.push({ ime: osoba.ime, prezime: osoba.prezime, lokacija: "U " + zauzece.salaAssociation.naziv });
                            redFlag = false;
                            break;
                        }
                        else if (!zauzece.terminAssociation.redovni && datumStr == zauzece.terminAssociation.datum && preklapanjeTrenutnogVremenaITermina(zauzece.terminAssociation.pocetak, zauzece.terminAssociation.kraj, stringVremena)) {
                            osobljeLokacija.push({ ime: osoba.ime, prezime: osoba.prezime, lokacija: "U " + zauzece.salaAssociation.naziv });
                            redFlag = false;
                            break;
                        }
                    }
                }
                if (redFlag) {
                    osobljeLokacija.push({ ime: osoba.ime, prezime: osoba.prezime, lokacija: "U kancelariji" });
                }
                else redFlag = true;
            });

            res.json(osobljeLokacija);

        });
    });
});
// #endregion


// #region Spirala 3

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../html/pocetna.html'));
});

app.get('/pocetna.html', function (req, res) {
   res.sendFile(path.join(__dirname, '../html/pocetna.html'));
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

//Path za slanje jedne slike sa servera
app.get('/slike/:nazivSlike', function (req, res) {
    let nazivSlike = req.params["nazivSlike"];
    let fajlPath = '../img/' + nazivSlike;
    if (!(fs.existsSync(fajlPath))) throw "Greška odabrana slika ne postoji ";
    res.sendFile(path.join(__dirname, '../img/' + nazivSlike));

});

app.post('/slike', function (req, res) {
    let jsonResponse = req.body, listURL = [];

    if (!(jsonResponse.hasOwnProperty('firstLoad'))) {
        let novaVelicina = 0;
        fs.readdir('../img', (err, files) => {
            files.forEach(file => {
                novaVelicina++;
            });
            res.json({ novaVelicina: novaVelicina });
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
            globalPointer = 0;

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


function provjeriZauzeca(podaci) {
    let periodicnaZauzeca = podaci["periodicna"], vanrednaZauzeca = podaci["vanredna"];
    let datum = new Date(2020, nizMjeseci.indexOf(podaci["trenutniMjesec"]), ++podaci["odabraniDan"]);
    let periodicniDan = datum.getDay() - 2, tipSemestra = provjeriSemestar(podaci["trenutniMjesec"]), mon = nizMjeseci.indexOf(podaci["trenutniMjesec"]) + 1;
    let odabraniDan = podaci["odabraniDan"] - 1;
    //način kako je specificirano oznacavanje dana u spirali 2 je nekonzistentno sa Date tipom u JS-u
    if (periodicniDan == -2) periodicniDan = 5;
    else if (periodicniDan == -1) periodicniDan = 6;

    if (tipSemestra == null && (podaci["periodicnost"])) return { valid: false, stringDatuma: "", predavac: podaci["predavac"], uloga: podaci["uloga"] };

    let stringDana = (odabraniDan < 10 ? "0" : "") + odabraniDan, stringMjeseca = (mon < 10 ? "0" : "") + mon;
    let stringDatuma = stringDana + "." + stringMjeseca + ".2020.";
    //provjera periodicnih zauzeca
    for (let i = 0; i < periodicnaZauzeca.length; i++) {
        if (tipSemestra == periodicnaZauzeca[i]["semestar"] && podaci["opcija"] == periodicnaZauzeca[i]["naziv"]
            && periodicniDan == periodicnaZauzeca[i]["dan"] &&
            preklapanjeTermina(periodicnaZauzeca[i]["pocetak"], periodicnaZauzeca[i]["kraj"], podaci["pocetak"], podaci["kraj"])) {

            return { valid: false, stringDatuma: stringDatuma, predavac: podaci["predavac"], uloga: podaci["uloga"] };
        }
    }


    //provjera vanrednih zauzeca
    for (let i = 0; i < vanrednaZauzeca.length; i++) {
        let semestarMjeseca = vratiSemestarIzDatuma(vanrednaZauzeca[i]["datum"]);
         if (podaci["opcija"] == vanrednaZauzeca[i]["naziv"] && preklapanjeTermina(vanrednaZauzeca[i]["pocetak"], vanrednaZauzeca[i]["kraj"], podaci["pocetak"], podaci["kraj"])
            && (stringDatuma == vanrednaZauzeca[i]["datum"] || (podaci["periodicnost"] == true && vratiPeriodDatuma(vanrednaZauzeca[i]["datum"]) == periodicniDan && semestarMjeseca == tipSemestra)
            )) {
        return { valid: false, stringDatuma: stringDatuma, predavac: podaci["predavac"], uloga: podaci["uloga"] };
        }
    }

    if (podaci["periodicnost"] == true) {
        return { valid: true, dan: periodicniDan, semestar: tipSemestra, pocetak: podaci["pocetak"], kraj: podaci["kraj"], naziv: podaci["opcija"], predavac: podaci["predavac"], uloga: podaci["uloga"], periodic: true };
   }
    return { valid: true, datum: stringDatuma, pocetak: podaci["pocetak"], kraj: podaci["kraj"], naziv: podaci["opcija"], predavac: podaci["predavac"], uloga: podaci["uloga"], periodic: false };
}
app.listen(8080);
// #endregion


module.exports=app;