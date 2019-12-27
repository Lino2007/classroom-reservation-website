var pocetak, kraj, opcija, trenutniMjesec , periodicnost;

window.onload = (event) => {
    var d = new Date();
    Kalendar.iscrtajKalendar(document.getElementById("datumi"), d.getMonth());
    let arr= Pozivi.ucitajPodatkeIzJSON();

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
    let potvrda = confirm("Da li želite rezervisati odabrani termin?");
     let chc =Kalendar.provjeraZauzeca(odabraniDan);
     if (chc)  {alert("Klijent strana je detektovala zauzece");
     return ;
}
    if (potvrda) {
        Pozivi.posaljiTermin ({pocetak:pocetak , kraj:kraj, opcija:opcija, trenutniMjesec:trenutniMjesec, odabraniDan:odabraniDan, periodicnost:periodicnost});
    }
   // alert (potvrda ? "Prihvatili ste rezervaciju!" : "Niste prihvatili rezervaciju!");
}
