window.onload = (event) => {
    var d = new Date();
    Kalendar.iscrtajKalendar(document.getElementById("datumi"), d.getMonth());
    let arr= Pozivi.ucitajPodatkeIzJSON();
  Kalendar.ucitajPodatke(arr[0], arr[1]);
    Kalendar.ucitajPodatkeIzForme ();
};

function rezervirajTermin (odabraniDan) {
    alert("Kliknut je kalendar za datum: " + odabraniDan);
}
