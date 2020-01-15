


window.onload = (event) => {
   Pozivi.dobaviPodatkeZaTabelu();
 
   recall = setInterval(function(){Pozivi.dobaviPodatkeZaTabelu(); }, 30000);
};


function ucitajTabelu (osoblje) {
    let lista= document.getElementById('listaOsoblja');
    lista.innerHTML= "";
    osoblje.forEach(function(item){
        lista.innerHTML +="<ul>"+  item.ime + " " + item.prezime + " ("+ item.lokacija +")</ul>";
    });
     
}
