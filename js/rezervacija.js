var pocetak, kraj, opcija, trenutniMjesec , periodicnost, dan;

window.onload = (event) => {
    var d = new Date();
    //ne idem u sljedeci mjesec jer je to vec 2020, ovaj kalendar je za 2019
    Kalendar.iscrtajKalendar(document.getElementById("datumi"), 11);
     Pozivi.ucitajPodatkeIzJSON(true);

};

function validirajFormu () {
  return pocetak!="" && kraj!="" && pocetak<=kraj;
}

function ucitajFormu () {
   pocetak = document.getElementById("pocetak").value;
   kraj = document.getElementById("kraj").value;
   opcija = document.getElementById("saleSelect").value;
   trenutniMjesec = document.getElementById("month").textContent;
   periodicnost = document.getElementById("periodicnost").checked;
   return validirajFormu();
}
 // a 

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
      Pozivi.ucitajPodatkeIzJSON(true); 
     return ;
      
    }
    if (potvrda) {
        Pozivi.ucitajPodatkeIzJSON(false);
       // Pozivi.posaljiTermin ({pocetak:pocetak , kraj:kraj, opcija:opcija, trenutniMjesec:trenutniMjesec, odabraniDan:odabraniDan, periodicnost:periodicnost});
    }
  
}

function slanjeTermina () {
    Pozivi.posaljiTermin ({pocetak:pocetak , kraj:kraj, opcija:opcija, trenutniMjesec:trenutniMjesec, odabraniDan:dan, periodicnost:periodicnost});
}
