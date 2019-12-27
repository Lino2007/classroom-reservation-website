var slikeCache = [] , velicina, pointer, sljedeciBlok;


window.onload = (event) => {
    velicina=pointer=0;
    slikeCache=[];
    if (window.location.href == "http://localhost:8080/") window.location.href='/pocetna';
    Pozivi.prvoUcitavanjeSlika();
};


function postaviVelicinu (vel) {
    velicina=vel;
}

function postaviPointer (ptr) {
   pointer=ptr;
   if (pointer == velicina) {document.getElementById("nxt").disabled = true;
  }
   else document.getElementById("nxt").disabled = false;
}
function napuniCache (slike) {
    if (pointer != velicina) {
      
         slikeCache = $.extend(slikeCache, slike);

    }
    console.log(slikeCache);
    console.log(slikeCache.length);
}

function prikaziSlike (listaSlika) {
    let imgContent = "" , targetDiv = document.getElementsByClassName("slike")[0];
    //targetDiv.innerHTML = "";
   for (let i = 0; i<listaSlika.length; i++) {
         imgContent += "<img src='"+ listaSlika[i]["slika"] + "' alt='" + i + "slika'>\n";
     }
    targetDiv.innerHTML =  imgContent;

    console.log(velicina + " " + pointer);
}

function sljedeci () {
    if (slikeCache.length!=velicina && )
    Pozivi.ucitajNoveSlike(pointer);
}
 
//document.getElementById("myBtn").disabled = true;



/*
<img src="../img/css-image.png" alt="css-slika1" >
                                    <img  src="../img/html-image.jpg" alt="html-slika1">
                                    <img  src="../img/php-image.jpg" alt="php-slika1"> */
