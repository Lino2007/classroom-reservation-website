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

app.post ('/pocetna' , function (req, res) {
    let jsonResponse= req.body, listURL = [];
    console.log(req.body);
    if (!(jsonResponse.hasOwnProperty('firstLoad'))) throw "Pogrešan header!";
    else if (jsonResponse["firstLoad"]) {
       let i =0, ptr=0;
       fs.readdirSync('../img').forEach(file => {
         
           if (i<3) {
               ptr= i+1;
           listURL.push({ slika: "../img/" + file});
           }
           i++;
         });
       res.json({listURL : listURL , ptr: ptr , velicina: i});
    }
    else {
        console.log("Učitajem nove slike");
        let ptr= jsonResponse["ptr"], vel= jsonResponse["velicina"];
        let limit = ptr+ 2, i=0, newPtr= ptr;
        fs.readdirSync('../img').forEach(file => {
          if (i>=ptr &&  i<=limit) { listURL.push({ slika: "../img/" + file});
         newPtr++;
        }
             i++;
            if (i==limit ) return ;
          });
          res.json({listURL : listURL , ptr: newPtr});
    }

});

app.get ('/zauzeca.json' , function (req, res) {
    res.sendFile(path.join(__dirname, '../json/zauzeca.json'));
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
  let jsonResponse= provjeriZauzeca (req.body);
  
  if (!(jsonResponse["valid"])) {
      if (jsonResponse["stringDatuma"]!="")
      jsonResponse["alert"] = "Nije moguće rezervisati salu " +req.body["opcija"] +"za navedeni datum "+ jsonResponse["stringDatuma"] + " i termin od " + req.body["pocetak"] + " do " + req.body["kraj"] ;
      else
      jsonResponse["alert"] = "Nije moguće praviti periodične rezervacije u periodu van zimskog ili ljetnog semestra!";
  }
  else {
  
       azurirajJSON (jsonResponse);
  }

  res.json (jsonResponse);
 // console.log (JSON.stringify(jsonResponse));
   // if (!(jsonResponse["valid"])) throw "Nije moguće rezervisati salu " +req.body["opcija"] +"za navedeni datum "+ jsonResponse["stringDatuma"] + " i termin od " + req.body["pocetak"] + " do " + req.body["kraj"] ;
 // Kalendar.ucitajPodatke();

}); 

function azurirajJSON (js_respa) {
    fs.readFile('../json/zauzeca.json', 'utf8', function (errx, data) {
        if (errx) throw errx;
       let obj = JSON.parse(data);
        obj.periodicna = js_respa["periodicnaZauzeca"];
        obj.vanredna = js_respa["vanrednaZauzeca"];
       
        fs.writeFile("../json/zauzeca.json", JSON.stringify(obj), function(err) {
            if(err) {
                throw err;
            }
            console.log("OK");
        }); 
      });
} 

function provjeriSemestar (trenutniMjesec) {
  
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
    if ((poc >= pocetak && poc < kraj) || (kr > pocetak && kr <= kraj) || (poc <= pocetak && kr >= kraj))  return true;
     return false;
  }
function vratiPeriodDatuma  (dateStr) {
     let arr = dateStr.split(".");
       // return arr[0];
    let mjesec = parseInt(arr[1], 10) , dan = parseInt(arr[0], 10);
    
    mjesec--;
     let datr = new Date (2019, mjesec , dan );
     let val = datr.getDay()-1;
      if (val==-1) val=6;  
   return val;
      
}

function vratiSemestarIzBrojaMjeseca (mj) {
    let arr = mj.split(".");
    let br = parseInt(arr[1])-1;
    return (br<=5) ? "ljetni" : "zimski";
}
function provjeriZauzeca (podaci) {
      let periodicnaZauzeca= podaci["periodicna"], vanrednaZauzeca= podaci["vanredna"];
      let datum = new Date (2019, nizMjeseci.indexOf(podaci["trenutniMjesec"]), ++podaci["odabraniDan"]) ;
      let periodicniDan = datum.getDay() -2, tipSemestra = provjeriSemestar(podaci["trenutniMjesec"]), mon =nizMjeseci.indexOf(podaci["trenutniMjesec"]) +1;
      let odabraniDan =  podaci["odabraniDan"] -1;
      //način kako je specificirano oznacavanje dana u spirali 2 je nekonzistentno sa Date tipom u JS-u
      if (periodicniDan==-2) periodicniDan=5;
      else if (periodicniDan==-1) periodicniDan=6;
      
      if (tipSemestra==null  &&  (podaci["periodicnost"]))   return {valid: false , stringDatuma : ""};
      
      let stringDana = (odabraniDan < 10 ? "0" : "") + odabraniDan, stringMjeseca = (mon< 10 ? "0" : "") + mon; 
      let stringDatuma = stringDana + "." + stringMjeseca + ".2019."; 
      //provjera periodicnih zauzeca
      for (let i =0 ; i<periodicnaZauzeca.length ; i++) {
         if (tipSemestra== periodicnaZauzeca[i]["semestar"] && podaci["opcija"]==periodicnaZauzeca[i]["naziv"]
          && periodicniDan==periodicnaZauzeca[i]["dan"] && 
          preklapanjeTermina(periodicnaZauzeca[i]["pocetak"],periodicnaZauzeca[i]["kraj"], podaci["pocetak"], podaci["kraj"])) {
              console.log ("Prva petlja");
            return {valid: false , stringDatuma : stringDatuma};
         }
      }
      
      
      //provjera vanrednih zauzeca
     for (let i =0 ; i<vanrednaZauzeca.length ; i++) {
       
         let semestarMjeseca = vratiSemestarIzBrojaMjeseca(vanrednaZauzeca[i]["datum"] );
         
      if (podaci["opcija"]==vanrednaZauzeca[i]["naziv"] &&  preklapanjeTermina(vanrednaZauzeca[i]["pocetak"],vanrednaZauzeca[i]["kraj"], podaci["pocetak"], podaci["kraj"])  
       &&  (stringDatuma==vanrednaZauzeca[i]["datum"]   || ( podaci["periodicnost"]==true &&  vratiPeriodDatuma(vanrednaZauzeca[i]["datum"]) == periodicniDan && semestarMjeseca==tipSemestra)
        )) {
         
        return {valid: false ,  stringDatuma : stringDatuma};
        }
     }
     
     if (podaci["periodicnost"]== true ) {
        
         periodicnaZauzeca.push({dan:periodicniDan , semestar:tipSemestra , pocetak: podaci["pocetak"], kraj: podaci["kraj"], naziv:podaci["opcija"], predavac:"Predavac" });
     }
     else vanrednaZauzeca.push({datum:stringDatuma , pocetak: podaci["pocetak"], kraj: podaci["kraj"], naziv:podaci["opcija"], predavac:"Predavac" });

     return {valid: true , periodicnaZauzeca: periodicnaZauzeca , vanrednaZauzeca : vanrednaZauzeca};

}

app.listen(8080);