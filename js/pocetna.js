var slikeCache = [];


window.onload = (event) => {
 //  slikeCache = 
 if (window.location.href == "http://localhost:8080/") window.location.href='/pocetna';
 //console.log(window.location.href);
  Pozivi.prvoUcitavanjeSlika();

};


function napuniCache (slike) {
     slikeCache = $.extend(slikeCache, slike);
     console.log (slikeCache);
}

function prikaziSlike (listaSlika) {
    let imgContent = "" , targetDiv = document.getElementsByClassName("slike")[0];
    //targetDiv.innerHTML = "";
   for (let i = 0; i<listaSlika.length; i++) {
         imgContent += "<img src='"+ listaSlika[i]["slika"] + "' alt='" + i + "slika'>\n";
     }
    targetDiv.innerHTML =  imgContent;
}


/*
<img src="../img/css-image.png" alt="css-slika1" >
                                    <img  src="../img/html-image.jpg" alt="html-slika1">
                                    <img  src="../img/php-image.jpg" alt="php-slika1"> */
