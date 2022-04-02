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


// #region Inicijalizacija Baze

db.sequelize.sync({ force: true }).then(function () {
    init();
}).catch(function(e) { console.log(e);
                      process.exit(1); });


function init() {
    //formiram listu osoblja
    db.Osoblje.create({ ime: 'Neko', prezime: 'Nekić', uloga: 'profesor' }).then(function (a) {
        var neko = a;
        db.Osoblje.create({ ime: 'Drugi', prezime: 'Neko', uloga: 'asistent' }).then(function (d) {
            var drugi = d;
            db.Osoblje.create({ ime: 'Test', prezime: 'Test', uloga: 'asistent' }).then(function () {
                //formiram listu Termina


                //formiram listu Sala
                db.Termin.create({ redovni: false, dan: null, datum: '05.12.2020.', semestar: null, pocetak: '12:00', kraj: "13:00" }).then(t => {
                    var ter = t;
                    db.Sala.create({ naziv: "VA1", zaduzenaOsoba: 1 }).then(f => {
                        db.Rezervacija.create({ termin: ter.dataValues.id, sala: f.dataValues.id, osoba: neko.dataValues.id });
                    });
                });
                db.Termin.create({ redovni: true, dan: 0, datum: null, semestar: 'zimski', pocetak: '13:00', kraj: "14:00" }).then(t2 => {
                    var ter2 = t2;
                    db.Sala.create({ naziv: "VA2", zaduzenaOsoba: 1 }).then(f => {
                        db.Rezervacija.create({ termin: ter2.dataValues.id, sala: f.dataValues.id, osoba: drugi.dataValues.id });
                        db.Sala.create({ naziv: "MA", zaduzenaOsoba: 1 });
                        db.Sala.create({ naziv: "EE1", zaduzenaOsoba: 1 });
                        db.Sala.create({ naziv: "EE2", zaduzenaOsoba: 1 }).then(function () {
                            db.Sala.create({ naziv: "0-01", zaduzenaOsoba: 2 });
                            db.Sala.create({ naziv: "0-02", zaduzenaOsoba: 3 });
                            db.Sala.create({ naziv: "0-03", zaduzenaOsoba: 2 });
                            db.Sala.create({ naziv: "0-04", zaduzenaOsoba: 1 });
                            db.Sala.create({ naziv: "0-05", zaduzenaOsoba: 3 });
                            db.Sala.create({ naziv: "0-06", zaduzenaOsoba: 1 });
                            db.Sala.create({ naziv: "0-07", zaduzenaOsoba: 2 });
                            db.Sala.create({ naziv: "0-08", zaduzenaOsoba: 1 });
                            db.Sala.create({ naziv: "0-09", zaduzenaOsoba: 3 });
                            db.Sala.create({ naziv: "1-01", zaduzenaOsoba: 3 });
                            db.Sala.create({ naziv: "1-02", zaduzenaOsoba: 1 });
                            db.Sala.create({ naziv: "1-03", zaduzenaOsoba: 3 });
                            db.Sala.create({ naziv: "1-04", zaduzenaOsoba: 1 });
                            db.Sala.create({ naziv: "1-05", zaduzenaOsoba: 2 });
                            db.Sala.create({ naziv: "1-06", zaduzenaOsoba: 3 });
                            db.Sala.create({ naziv: "1-07", zaduzenaOsoba: 2 });
                            db.Sala.create({ naziv: "1-08", zaduzenaOsoba: 1 });
                            db.Sala.create({ naziv: "1-09", zaduzenaOsoba: 3 });
                        });
                    });
                });
            });
        });
    }).then(function () { console.log("Database loaded!") });
}
// #endregion


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

//ruta za preuzimanje zauzeca/rezervacija
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
        include: [{ model: db.Sala, as: "salaAssociation" },
        { model: db.Osoblje },
        { model: db.Termin, as: "terminAssociation" }
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
                jsonResponse["alert"] = "It's not possible to reserve classroom " + req.body["opcija"] + " for the following date " + jsonResponse["stringDatuma"].replace('.', ' ') + " and period from " + req.body["pocetak"] + " to " + req.body["kraj"] + "!";
                jsonResponse["alert"] += "\n(Classroom already reserved " + jsonResponse["uloga"] + " " + jsonResponse["predavac"] + ")";
            }
            else {
                let strv = "It's not possible to reserve classroom " + req.body["opcija"] + " for the following date " + jsonResponse["stringDatuma"].replace('.', ' ') + " and period from " + req.body["pocetak"] + " to " + req.body["kraj"] + "!";
                jsonResponse["alert"] = strv + "\n (You are not allowed to make reservations outside of winter or summer semesters!)";
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
    let strSat = (dat.getHours() < 10) ? ('0' + dat.getHours()) : dat.getHours(), strMin = (dat.getMinutes() < 10) ? ('0' + dat.getMinutes()) : dat.getMinutes();
    let strSek = (dat.getSeconds() < 10) ? ('0' + dat.getSeconds()) : dat.getSeconds();
    let stringVremena = strSat + ":" + strMin + ":" + strSek;
    let periodicniDan = dat.getDay() - 1, mjesecTrenutni = dat.getMonth() + 1, dateString = ((dat.getDate() >= 10) ? "" : "0") + dat.getDate();
    let mjesecTrenutniString = ((mjesecTrenutni >= 10) ? "" : "0") + mjesecTrenutni, strSemestra = numerickaProvjeraSemestra(mjesecTrenutni - 1);
    let datumStr = dateString + "." + mjesecTrenutniString + ".2020.";
    if (periodicniDan == -1) periodicniDan = 6; //jer je u spirali ponedjeljak 0 (u js je ponedjeljak 1)
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
                            osobljeLokacija.push({ ime: osoba.ime, prezime: osoba.prezime, uloga: osoba.uloga ,lokacija: "In " + zauzece.salaAssociation.naziv });
                            redFlag = false;
                            break;
                        }
                        else if (!zauzece.terminAssociation.redovni && datumStr == zauzece.terminAssociation.datum && preklapanjeTrenutnogVremenaITermina(zauzece.terminAssociation.pocetak, zauzece.terminAssociation.kraj, stringVremena)) {
                            osobljeLokacija.push({ ime: osoba.ime, prezime: osoba.prezime, uloga: osoba.uloga ,lokacija: "In " + zauzece.salaAssociation.naziv });
                            redFlag = false;
                            break;
                        }
                    }
                }
                if (redFlag) {
                    osobljeLokacija.push({ ime: osoba.ime, prezime: osoba.prezime, uloga: osoba.uloga ,lokacija: "In office" });
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

            return { valid: false, stringDatuma: stringDatuma, predavac: periodicnaZauzeca[i]["predavac"], uloga: periodicnaZauzeca[i]["uloga"] };
        }
    }


    //provjera vanrednih zauzeca
    for (let i = 0; i < vanrednaZauzeca.length; i++) {
        let semestarMjeseca = vratiSemestarIzDatuma(vanrednaZauzeca[i]["datum"]);
        if (podaci["opcija"] == vanrednaZauzeca[i]["naziv"] && preklapanjeTermina(vanrednaZauzeca[i]["pocetak"], vanrednaZauzeca[i]["kraj"], podaci["pocetak"], podaci["kraj"])
            && (stringDatuma == vanrednaZauzeca[i]["datum"] || (podaci["periodicnost"] == true && vratiPeriodDatuma(vanrednaZauzeca[i]["datum"]) == periodicniDan && semestarMjeseca == tipSemestra)
            )) {
            return { valid: false, stringDatuma: stringDatuma, predavac: vanrednaZauzeca[i]["predavac"], uloga: vanrednaZauzeca[i]["uloga"] };
        }
    }

    if (podaci["periodicnost"] == true) {
        return { valid: true, dan: periodicniDan, semestar: tipSemestra, pocetak: podaci["pocetak"], kraj: podaci["kraj"], naziv: podaci["opcija"], predavac: podaci["predavac"], uloga: podaci["uloga"], periodic: true };
    }
    return { valid: true, datum: stringDatuma, pocetak: podaci["pocetak"], kraj: podaci["kraj"], naziv: podaci["opcija"], predavac: podaci["predavac"], uloga: podaci["uloga"], periodic: false };
}
app.listen(8080);
// #endregion


module.exports = app;
