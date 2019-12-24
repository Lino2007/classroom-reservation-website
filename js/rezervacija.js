
var pocetak, kraj,opcija, trenutniMjesec;
window.onload = (event) => {
    var d = new Date();
    Kalendar.iscrtajKalendar(document.getElementById("datumi"), d.getMonth());
    let arr= Pozivi.ucitajPodatkeIzJSON();
    Kalendar.ucitajPodatke(arr[0], arr[1]);
    Kalendar.ucitajPodatkeIzForme ();
};

function validirajFormu () {
  return pocetak!="" && kraj!="" && pocetak<=kraj;
}

function ucitajFormu () {
   pocetak = document.getElementById("pocetak").value;
   kraj = document.getElementById("kraj").value;
   opcija = document.getElementById("saleSelect").value;
   trenutniMjesec = document.getElementById("month").textContent;
   return validirajFormu();
}

function rezervirajTermin (odabraniDan) {
    if (!ucitajFormu()) { 
        alert("Greška: Nespravni podaci u formi.");
        return ;
    }
    let potvrda = confirm("Da li želite rezervisati odabrani termin?");
    alert (potvrda ? "Prihvatili ste rezervaciju!" : "Niste prihvatili rezervaciju!");
}
