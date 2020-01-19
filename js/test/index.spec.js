const supertest = require("supertest");
const assert = require('assert');
const app = require("../index");
var chai = require('chai'), chaiHttp = require('chai-http');
var expect = chai.expect;

chai.use(chaiHttp);

describe("GET /sale", function() {
//provjeravam da li ruta korektno vraća sale
  it("Vraca kompletnu listu sala", function(done) {
    chai.request('http://localhost:8080')
    .get('/sale')
    .end(function(err, res) {
       let listaSala = res.body;
       let ocekivaneSale = ["MA", "VA1", "0-01", "0-02", "0-03", "0-04", "0-05", "0-06"
       , "0-07", "0-08" , "0-09", "1-01", "1-02", "1-03", "1-04", "1-05", "1-06"
       , "1-07", "1-08" , "1-09", "EE1", "EE2"];
       //eliminisu se elementi niza ocekivaneSale na osnovu vracene liste sala sa servera
       //ocekuje se da se niz ocekivaneSale isprazni
       listaSala.forEach(element => {
        ocekivaneSale.splice( ocekivaneSale.indexOf(element.naziv), 1 );
       });
       expect(ocekivaneSale).to.have.lengthOf(0);
       done();                     
      });
  });
});


describe("GET /osoblje", function() {
 //provjeravam da li ruta korektno vraća osoblje
    it("Vraca kompletnu listu osoblja", function(done) {
      chai.request('http://localhost:8080')
      .get('/osoblje')
      .end(function(err, res) {
         let listaOsoblja = res.body;
         let ocekivanoOsoblje = ["Neko Nekić profesor", "Test Test asistent", "Drugi Neko asistent"];
         //slican princip kao u prethodnom testu
         listaOsoblja.forEach(element => {
           let stringOsobljaIzBaze = element.ime + " " + element.prezime + " "+ element.uloga;
            ocekivanoOsoblje.splice( ocekivanoOsoblje.indexOf(stringOsobljaIzBaze), 1 );
         });
         expect(ocekivanoOsoblje).to.have.lengthOf(0);
         done();                     
        });
    });
  });



  describe("GET /zauzeca", function() {
    //provjeravam da li ruta korektno vraća zauzeca pri cemu se ovaj test se ne odnosi 
    // na testiranje azuriranih zauzeca, nego za provjeru rada rute
       it("Vraca kompletnu listu zauzeca", function(done) {
         chai.request('http://localhost:8080')
         .get('/zauzeca')
         .end(function(err, res) {
           //u listi zauzeca se moraju nalaziti zauzeca koja smo dodali kroz init() metodu iz index.js
            let listaZauzeca = res.body;
            console.log(res.body);
            let ocekivanoPeriodicnoZauzece ={"dan":0,"semestar":"zimski","pocetak":"13:00:00","kraj":"14:00:00","naziv":"VA2","predavac":"Drugi Neko","uloga":"asistent"};
            let ocekivanoVanrednoZauzece ={"datum":"05.12.2020.","pocetak":"12:00:00","kraj":"13:00:00","naziv":"VA1","predavac":"Neko Nekić","uloga":"profesor"};
            //provjeravamo da li su vracena zauzeca jednaka sa ocekivanim zauzecima
            let jednakaRedovnaZauzeca =  JSON.stringify(listaZauzeca["periodicna"][0]) == JSON.stringify(ocekivanoPeriodicnoZauzece), 
            jednakaVanrednaZauzeca=   JSON.stringify(listaZauzeca["vanredna"][0])== JSON.stringify(ocekivanoVanrednoZauzece);
           
            expect(jednakaRedovnaZauzeca && jednakaVanrednaZauzeca).to.equal(true);
            done();                     
           });
       });
     });


     describe("POST /rezervacija", function() {
      //provjeravam da li ruta korektno vraća zauzeca pri cemu se ovaj test se ne odnosi 
      // na testiranje azuriranih zauzeca, nego za provjeru rada rute
         it("Vraca kompletnu listu zauzeca", function(done) {
           chai.request('http://localhost:8080')
           .get('/zauzeca')
           .end(function(err, res) {
             //u listi zauzeca se moraju nalaziti zauzeca koja smo dodali kroz init() metodu iz index.js
              let listaZauzeca = res.body;
              console.log(res.body);
              let ocekivanoPeriodicnoZauzece ={"dan":0,"semestar":"zimski","pocetak":"13:00:00","kraj":"14:00:00","naziv":"VA2","predavac":"Drugi Neko","uloga":"asistent"};
              let ocekivanoVanrednoZauzece ={"datum":"05.12.2020.","pocetak":"12:00:00","kraj":"13:00:00","naziv":"VA1","predavac":"Neko Nekić","uloga":"profesor"};
              //provjeravamo da li su vracena zauzeca jednaka sa ocekivanim zauzecima
              let jednakaRedovnaZauzeca =  JSON.stringify(listaZauzeca["periodicna"][0]) == JSON.stringify(ocekivanoPeriodicnoZauzece), 
              jednakaVanrednaZauzeca=   JSON.stringify(listaZauzeca["vanredna"][0])== JSON.stringify(ocekivanoVanrednoZauzece);
             
              expect(jednakaRedovnaZauzeca && jednakaVanrednaZauzeca).to.equal(true);
              done();                     
             });
         });
       });



     /*{
  pocetak: '01:00',
  kraj: '23:00',
  opcija: 'VA1',
  trenutniMjesec: 'Decembar',
  odabraniDan: 12,
  periodicnost: true,
  predavac: 'Neko Nekic',
  uloga: 'profesor'
}
*/