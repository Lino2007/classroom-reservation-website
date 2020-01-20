var pocetak, kraj, opcija, trenutniMjesec , periodicnost, dan, imeOsobe;
var listaOsoblja = [];
window.onload = (event) => {
    var d = new Date();
    Kalendar.iscrtajKalendar(document.getElementById("datumi"), d.getMonth());
     Pozivi.dobaviPodatkeZaSelect();
};

// #region Spirala 4
function ucitajSelectOsoblja (osoblje) {
    listaOsoblja=[];
    let select= document.getElementById('osobljeSelect');
    osoblje.forEach(function(item){
        let option = document.createElement('option');
        option.value= item.ime + " " + item.prezime;
        option.appendChild(document.createTextNode(option.value));
        select.appendChild(option);
        listaOsoblja.push({naziv: option.value, uloga: item.uloga});
      });
    Pozivi.dobaviSale();
}

function ucitajSelectSala (osoblje) {
    let select= document.getElementById('saleSelect');
    osoblje.forEach(function(item){
        let option = document.createElement('option');
        option.value= item.naziv;
        option.appendChild(document.createTextNode(option.value));
        select.appendChild(option);
      });
      Pozivi.ucitajIzBaze(true);
}

function dajUlogu (imeOsobe) {
  let uloga = "unknown";
 listaOsoblja.forEach (function(item) {
    if (item.naziv==imeOsobe) {
           console.log(item.uloga);
           uloga= item.uloga;
       }
   });
   return uloga;
}
// #endregion


// #region Spirala 3

function validirajFormu () {
  return pocetak!="" && kraj!="" && pocetak<=kraj;
}

function ucitajFormu () {
   pocetak = document.getElementById("pocetak").value;
   kraj = document.getElementById("kraj").value;
   opcija = document.getElementById("saleSelect").value;
   trenutniMjesec = document.getElementById("month").textContent;
   periodicnost = document.getElementById("periodicnost").checked;
   imeOsobe = document.getElementById("osobljeSelect").value;
   return validirajFormu();
}

function rezervirajTermin (odabraniDan) {
   
    if (!ucitajFormu()) { 
        alert("Greška: Nespravni podaci u formi.");
        return ;
    }
    dan= odabraniDan;
    let potvrda = confirm("Da li želite rezervisati odabrani termin?");
    let chc =Kalendar.provjeraZauzeca(odabraniDan);
    
    if (chc)  {
     let dat = Kalendar.formirajDatum(odabraniDan, trenutniMjesec);
     let podaciOsobe = "(Zahtjev za rezervisanje poslao " + dajUlogu(imeOsobe)+ " " +imeOsobe + ")";
     alert("Nije moguće rezervisati salu " + opcija + " za navedeni datum " + dat + " i termin od " + pocetak + " do " + kraj + "!\n" + podaciOsobe);
      Pozivi.ucitajIzBaze(true); 
     return ;
   }
    if (potvrda) {
        Pozivi.ucitajIzBaze(false);
    }
  
}

function slanjeTermina () {
    Pozivi.posaljiTermin ({pocetak:pocetak , kraj:kraj, opcija:opcija, trenutniMjesec:trenutniMjesec, odabraniDan:dan, periodicnost:periodicnost, predavac:imeOsobe , uloga:dajUlogu(imeOsobe)});
}
//#endregion