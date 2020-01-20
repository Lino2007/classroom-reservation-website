const app = require("../indexTest");
var chai = require('chai'), chaiHttp = require('chai-http');
var expect = chai.expect;

chai.use(chaiHttp);

let periodicnoZauzece ={ pocetak: '16:00', kraj: '17:00',opcija: 'MA', trenutniMjesec: 'Januar',odabraniDan: 4, periodicnost: true,predavac: 'Neko Nekić',uloga: 'profesor'};
let vanrednoZauzece = {pocetak: '16:00', kraj: '17:00',opcija: 'EE1', trenutniMjesec: 'Januar',odabraniDan: 5, periodicnost: false,predavac: 'Neko Nekić',uloga: 'profesor'};



describe("Test 1: GET /sale", function() {
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
         expect(res).to.have.status(200); //mora vratiti 200 status kod
         expect(ocekivaneSale).to.have.lengthOf(0);
         done();                     
        });
    });
  });
  
  
  describe("Test 2: GET /osoblje", function() {
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
           expect(res).to.have.status(200); //mora vratiti 200 status kod
           expect(ocekivanoOsoblje).to.have.lengthOf(0);
           done();                     
          });
      });
    });
  
  
  
    describe("Test 3: GET /zauzeca", function() {
      //provjeravam da li ruta korektno vraća zauzeca pri cemu se ovaj test se ne odnosi 
      // na testiranje azuriranih zauzeca, nego za provjeru rada rute
         it("Vraca kompletnu listu zauzeca", function(done) {
           chai.request('http://localhost:8080')
           .get('/zauzeca')
           .end(function(err, res) {
             //u listi zauzeca se moraju nalaziti zauzeca koja smo dodali kroz init() metodu iz index.js
              let listaZauzeca = res.body;
             
              let ocekivanoPeriodicnoZauzece ={"dan":0,"semestar":"zimski","pocetak":"13:00:00","kraj":"14:00:00","naziv":"VA2","predavac":"Drugi Neko","uloga":"asistent"};
              let ocekivanoVanrednoZauzece ={"datum":"05.12.2020.","pocetak":"12:00:00","kraj":"13:00:00","naziv":"VA1","predavac":"Neko Nekić","uloga":"profesor"};
              //provjeravamo da li su vracena zauzeca jednaka sa ocekivanim zauzecima
              let jednakaRedovnaZauzeca =  JSON.stringify(listaZauzeca["periodicna"][0]) == JSON.stringify(ocekivanoPeriodicnoZauzece), 
              jednakaVanrednaZauzeca=   JSON.stringify(listaZauzeca["vanredna"][0])== JSON.stringify(ocekivanoVanrednoZauzece);
              expect(res).to.have.status(200); //mora vratiti 200 status kod
              expect(jednakaRedovnaZauzeca && jednakaVanrednaZauzeca).to.equal(true);
              done();                     
             });
         });
       });
  
       
       describe("Test 4: POST /rezervacija", function() {
      
        //Provjera da li se rezervacija dodaje u bazu te da li se zauzeca/rezervacije azuriraju u bazi  
            let redZauz = { pocetak: '16:00', kraj: '17:00',opcija: 'MA', trenutniMjesec: 'Januar',odabraniDan: 4, periodicnost: true,predavac: 'Neko Nekić',uloga: 'profesor'};
            let ispravanRezultat={"dan":5,"semestar":"zimski","pocetak":"16:00:00","kraj":"17:00:00","naziv":"MA","predavac":"Neko Nekić","uloga":"profesor"};
          it("Uspjesno rezervise termin i lista rezervacija se u bazi azuriraju", function(done) {

              chai.request('http://localhost:8080')
              .post('/rezervacija')
              .set('content-type', 'application/json')
              .send(redZauz)
              .then(function(res) {
             /*   if (res.body.hasOwnProperty('alert')) {
                
                  done(new Error("Niste pozvali node index.js prije poziva testova!"));
                } */
          
                 chai.request('http://localhost:8080')
                 .get('/zauzeca')
                 .end(function(err, res) {
                 
                   let arr= res.body["periodicna"], postojiZauzece=false;
                  for (let i=0 ; i<arr.length; i++) {
                    if (JSON.stringify(arr[i])== JSON.stringify(ispravanRezultat)) {
                         postojiZauzece=true;
                         break;
                       }
                     }
                     expect(res).to.have.status(200); //mora vratiti 200 status kod
                   expect(postojiZauzece).to.equal(true);
                   done();
                 }); 
                                     
                });
            });
          });

  
      


         describe("Test 5: Konflikt izmedju periodicnog i vanrednog zauzeca - jedna osoba rezervise", function() {
      
          //Provjera da li se rezervacija dodaje u bazu te da li se zauzeca/rezervacije azuriraju u bazi  
          //jedna te ista osoba pravi rezervacije
              let redZauz = periodicnoZauzece, vanrZauz= vanrednoZauzece;
              redZauz["trenutniMjesec"] = 'Mart';
              vanrZauz["trenutniMjesec"]= 'Mart';
              vanrZauz["opcija"]='MA'; vanrZauz["odabraniDan"]= 4;
              let ispravanRezultat={"dan":2,"semestar":"ljetni","pocetak":"16:00:00","kraj":"17:00:00","naziv":"MA","predavac":"Neko Nekić","uloga":"profesor"};
              it("Redovno zauzece se rezervise, dok se vanredno ne rezervise", function(done) {
              
              // console.log(redZauz);
                chai.request('http://localhost:8080')
                .post('/rezervacija')
                .set('content-type', 'application/json')
                .send(redZauz)
                .then(function(res) {
                  chai.request('http://localhost:8080')
                  .post('/rezervacija')
                  .set('content-type', 'application/json')
                  .send(vanrZauz)
                  .then(function(res) {
                    //kad se desi konflikt izmedju zauzeca server vraca json response sa alert poljem (umjesto da rezervise termin)
                         var odg = res.body, postojiAlert=false;
                         if (odg.hasOwnProperty('alert')) postojiAlert=true;
                         chai.request('http://localhost:8080')
                         .get('/zauzeca')
                         .end(function(err, res) {
                          let arr= res.body["periodicna"], postojiZauzece=false;
                          for (let i=0 ; i<arr.length; i++) {
                               if (JSON.stringify(arr[i])== JSON.stringify(ispravanRezultat)) {
                                 postojiZauzece=true;
                                 break;
                               }
                             }

                            //Ako smo pronsali zauzece u bazi i ako postoji alert onda je izlaz testa true
                           expect(postojiZauzece && postojiAlert).to.equal(true);
                           done();
                         });

                   });
                                       
                  });
              });
            });


            describe("Test 6: Konflikt izmedju dva periodicna zauzeca -dvije razlicite osobe rezervisu", function() {
      
              //Provjera da li se rezervacija dodaje u bazu te da li se zauzeca/rezervacije azuriraju u bazi  
              //dodatna provjera ako dvije razlicite osobe pokusaju napraviti konfliktne rezervacije
              let redZauz1 = { pocetak: '16:00', kraj: '17:00',opcija: 'EE1', trenutniMjesec: 'Maj',odabraniDan: 4, periodicnost: true,predavac: 'Neko Nekić',uloga: 'profesor'};
              //odnosi se na ponedjeljak
              let redZauz2 =  { pocetak: '16:30', kraj: '17:00',opcija: 'EE1', trenutniMjesec: 'Maj',odabraniDan: 11, periodicnost: true,predavac: 'Drugi Neko',uloga: 'asistent'};
                  let ispravanRezultat={"dan":0,"semestar":"ljetni","pocetak":"16:00:00","kraj":"17:00:00","naziv":"EE1","predavac":"Neko Nekić","uloga":"profesor"};
                  it("Prvo redovno se rezervise,a drugo ne", function(done) {
                  
                 
                    chai.request('http://localhost:8080')
                    .post('/rezervacija')
                    .set('content-type', 'application/json')
                    .send(redZauz1)
                    .then(function(res) {
                      chai.request('http://localhost:8080')
                      .post('/rezervacija')
                      .set('content-type', 'application/json')
                      .send(redZauz2)
                      .then(function(res) {
                        //kad se desi konflikt izmedju zauzeca server vraca json response sa alert poljem (umjesto da rezervise termin)
                             var odg = res.body, postojiAlert=false;
                             if (odg.hasOwnProperty('alert')) postojiAlert=true;  //vracen alert
                             console.log(odg["alert"]);
                             chai.request('http://localhost:8080')
                             .get('/zauzeca')
                             .end(function(err, res) {
                              let arr= res.body["periodicna"], postojiZauzece=false;
                              for (let i=0 ; i<arr.length; i++) {
                                   if (JSON.stringify(arr[i])== JSON.stringify(ispravanRezultat)) {
                                     postojiZauzece=true;
                                     break;
                                   }
                                 }
                               expect(postojiZauzece && postojiAlert).to.equal(true);
                               done();
                             });
    
                       });
                                           
                      });
                  });
                });
  

                describe("Test 7: Konflikt izmedju dva vanredna zauzeca", function() {
      
                  //Provjera da li se rezervacija dodaje u bazu te da li se zauzeca/rezervacije azuriraju u bazi  
                  //dodatna provjera ako dvije razlicite osobe pokusaju napraviti konfliktne rezervacije 
                  //za vanredna zauzeca je periodicnost false
                  let Zauz1 = { pocetak: '16:00', kraj: '17:00',opcija: '0-01', trenutniMjesec: 'Oktobar',odabraniDan: 4, periodicnost: false,predavac: 'Neko Nekić',uloga: 'profesor'};
               
                  let Zauz2 =  { pocetak: '16:30', kraj: '18:00',opcija: '0-01', trenutniMjesec: 'Oktobar',odabraniDan: 4, periodicnost: false,predavac: 'Drugi Neko',uloga: 'asistent'};
                      let ispravanRezultat={"datum":"04.10.2020.","pocetak":"16:00:00","kraj":"17:00:00","naziv":"0-01","predavac":"Neko Nekić","uloga":"profesor"};
                      it("Prvo vanredno se rezervise,a drugo ne", function(done) {
                      
                     
                        chai.request('http://localhost:8080')
                        .post('/rezervacija')
                        .set('content-type', 'application/json')
                        .send(Zauz1)
                        .then(function(res) {
                 
                          chai.request('http://localhost:8080')
                          .post('/rezervacija')
                          .set('content-type', 'application/json')
                          .send(Zauz2)
                          .then(function(res) {
                            //kad se desi konflikt izmedju zauzeca server vraca json response sa alert poljem (umjesto da rezervise termin)
                                 var odg = res.body, postojiAlert=false;
                                 if (odg.hasOwnProperty('alert')) postojiAlert=true;  //vracen alert
                                 console.log(odg["alert"]);
                                 chai.request('http://localhost:8080')
                                 .get('/zauzeca')
                                 .end(function(err, res) {
                                  
                                  let arr= res.body["vanredna"], postojiZauzece=false;
                                 for (let i=0 ; i<arr.length; i++) {
                                    if (JSON.stringify(arr[i])== JSON.stringify(ispravanRezultat)) {
                                         postojiZauzece=true;
                                         break;
                                       }
                                     }

                                   expect(postojiZauzece && postojiAlert).to.equal(true);
                                   done();
                                 });
        
                           });
                                               
                          });
                      });
                    });
      

                    
                describe("Test 8: Konflikt periodicnog zauzeca sa vanrednim (vanredno u drugom mjesecu istog semestra)", function() {
      
                //Provjera da li se blokira rezevisanje periodicnog termina ako u drugim mjesecima tog termina ima vanredno zauzece na taj dan
                  let Zauz1 = { pocetak: '16:00', kraj: '17:00',opcija: '0-01', trenutniMjesec: 'Oktobar',odabraniDan: 5, periodicnost: false,predavac: 'Neko Nekić',uloga: 'profesor'};
                //5.10. je ponedjeljak, kao i 2.11.
                  let Zauz2 =  { pocetak: '16:30', kraj: '18:00',opcija: '0-01', trenutniMjesec: 'Novembar',odabraniDan: 2, periodicnost: true,predavac: 'Drugi Neko',uloga: 'asistent'};
                      let ispravanRezultat={"datum":"05.10.2020.","pocetak":"16:00:00","kraj":"17:00:00","naziv":"0-01","predavac":"Neko Nekić","uloga":"profesor"};
                      it("Vanredno se evidentira, dok se redovno ne evidentira", function(done) {
                      
                   
                        chai.request('http://localhost:8080')
                        .post('/rezervacija')
                        .set('content-type', 'application/json')
                        .send(Zauz1)
                        .then(function(res) {
                        
                          chai.request('http://localhost:8080')
                          .post('/rezervacija')
                          .set('content-type', 'application/json')
                          .send(Zauz2)
                          .then(function(res) {
                            //kad se desi konflikt izmedju zauzeca server vraca json response sa alert poljem (umjesto da rezervise termin)
                                 var odg = res.body, postojiAlert=false;
                                 if (odg.hasOwnProperty('alert')) postojiAlert=true;  //vracen alert
                                 console.log(odg["alert"]);
                                 chai.request('http://localhost:8080')
                                 .get('/zauzeca')
                                 .end(function(err, res) {
                                  
                                  let arr= res.body["vanredna"], postojiZauzece=false;
                                 for (let i=0 ; i<arr.length; i++) {
                                    if (JSON.stringify(arr[i])== JSON.stringify(ispravanRezultat)) {
                                         postojiZauzece=true;
                                         break;
                                       }
                                     }

                                   expect(postojiZauzece && postojiAlert).to.equal(true);
                                   done();
                                 });
        
                           });
                                               
                          });
                      });
                    });


                    describe("Test 9: Periodicna rezervacija u mjesecima van ljetnog/zimskog semestra", function() {
      
 
                        let Zauz1 = { pocetak: '16:00', kraj: '17:00',opcija: '0-01', trenutniMjesec: 'Juli',odabraniDan: 5, periodicnost: true,predavac: 'Neko Nekić',uloga: 'profesor'};
                        let Zauz2 =  { pocetak: '16:30', kraj: '18:00',opcija: '0-01', trenutniMjesec: 'August',odabraniDan: 2, periodicnost: true,predavac: 'Drugi Neko',uloga: 'asistent'};
                            let ispravanRezultat={"datum":"05.10.2020.","pocetak":"16:00:00","kraj":"17:00:00","naziv":"0-01","predavac":"Neko Nekić","uloga":"profesor"};
                            it("Zauzeca se ne evidentiraju", function(done) {
                             var alertZaJuli=false , alertZaAugust= false;
                            // console.log(redZauz);
                              chai.request('http://localhost:8080')
                              .post('/rezervacija')
                              .set('content-type', 'application/json')
                              .send(Zauz1)
                              .then(function(res) {
                                if (res.body.hasOwnProperty('alert')) alertZaJuli=true;
                                chai.request('http://localhost:8080')
                                .post('/rezervacija')
                                .set('content-type', 'application/json')
                                .send(Zauz2)
                                .then(function(res) {
                                  if(res.body.hasOwnProperty('alert')) alertZaAugust=true;
                                  expect(alertZaJuli && alertZaAugust).to.equal(true);  //zauzeca u ovim mjesecima nisu evidentirana
                                  done();
                                 });
                                                     
                                });
                            });
                          });


                          describe("Test 10: Kreiranje periodicnih zauzeca na isti dan, ali u razlicitim semestrima", function() {
                            //ponedjeljak
                              let Zauz1 = { pocetak: '13:00', kraj: '15:00',opcija: '0-02', trenutniMjesec: 'April',odabraniDan: 6, periodicnost: true,predavac: 'Neko Nekić',uloga: 'profesor'};
                              let Zauz2 =  { pocetak: '12:00', kraj: '18:00',opcija: '0-02', trenutniMjesec: 'Oktobar',odabraniDan: 5, periodicnost: true,predavac: 'Test Test',uloga: 'asistent'};
                              let ispravanRezultat1={"dan":0,"semestar":"ljetni","pocetak":"13:00:00","kraj":"15:00:00","naziv":"0-02","predavac":"Neko Nekić","uloga":"profesor"};
                              let ispravanRezultat2={"dan":0,"semestar":"zimski","pocetak":"12:00:00","kraj":"18:00:00","naziv":"0-02","predavac":"Test Test","uloga":"asistent"};
                                  it("Oba zauzeca se regularno evidentiraju u bazu.", function(done) {
                                  
                               
                                    chai.request('http://localhost:8080')
                                    .post('/rezervacija')
                                    .set('content-type', 'application/json')
                                    .send(Zauz1)
                                    .then(function(res) {
                                    
                                      chai.request('http://localhost:8080')
                                      .post('/rezervacija')
                                      .set('content-type', 'application/json')
                                      .send(Zauz2)
                                      .then(function(res) {
                                        
                                             chai.request('http://localhost:8080')
                                             .get('/zauzeca')
                                             .end(function(err, res) {
                                              
                                              let arr= res.body["periodicna"], postojiZauzece1=false, postojiZauzece2=false;
                                             for (let i=0 ; i<arr.length; i++) {
                                                if (JSON.stringify(arr[i])== JSON.stringify(ispravanRezultat1)) {
                                                     postojiZauzece1=true;
                                                   }
                                                else if (JSON.stringify(arr[i])== JSON.stringify(ispravanRezultat2)) {
                                                  postojiZauzece2=true;
                                                }
                                                 }
            
                                               expect(postojiZauzece1 && postojiZauzece2).to.equal(true);
                                               done();
                                             });
                    
                                       });
                                                           
                                      });
                                  });
                                });
 

