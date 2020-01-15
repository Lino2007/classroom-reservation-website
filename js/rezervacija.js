var pocetak, kraj, opcija, trenutniMjesec , periodicnost, dan, imeOsobe;
var listaOsoblja = [];
window.onload = (event) => {
  //  clearInterval(recall);
    if (!recall) clearInterval(recall);
    var d = new Date();
    //ne idem u sljedeci mjesec jer je to vec 2020, ovaj kalendar je za 2019
    Kalendar.iscrtajKalendar(document.getElementById("datumi"), 11);
    // Pozivi.ucitajPodatkeIzJSON(true);
     //** */
     Pozivi.dobaviPodatkeZaSelect();
  

};


function ucitajSelect (osoblje) {
    listaOsoblja=[];
    let select= document.getElementById('osobljeSelect');
    osoblje.forEach(function(item){
        let option = document.createElement('option');
        option.value= item.ime + " " + item.prezime;
        option.appendChild(document.createTextNode(option.value));
        select.appendChild(option);
        listaOsoblja.push({naziv: option.value, uloga: item.uloga});
      });
      Pozivi.ucitajIzBaze(true);
}

function dajUlogu (imeOsobe) {
  let uloga = "unknown";
 listaOsoblja.forEach (function(item) {
       console.log(item.naziv.length  + " "  + imeOsobe.length);
       console.log("|" +item.naziv + "|");
       console.log ("|" +imeOsobe + "|");
       if (item.naziv==imeOsobe) {
           console.log(item.uloga);
           uloga= item.uloga;
       }
   });
   return uloga;
}
//#region Spirala 3
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
     alert("Nije moguće rezervisati salu " + opcija + " za navedeni datum " + dat + " i termin od " + pocetak + " do " + kraj + "!");
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