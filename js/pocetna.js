var slikeCache = [], velicina, pointer, sljedeciBlok, cachePointer;


window.onload = (event) => {
    velicina = pointer = 0;
    slikeCache = [];
    // console.log ("!!");
    document.getElementById("prev").disabled = true;
    if (window.location.href == "http://localhost:8080/") window.location.href = '/pocetna.html';
    Pozivi.prvoUcitavanjeSlika(); //ucitavaju se prve slike iz foldera
};


function postaviVelicinu(vel) {
    velicina = vel;
}

function postaviPointer(ptr) {
    pointer = ptr;
    if (pointer == velicina) {
        // console.log("Blokada postaviPointer sljedeci");
        document.getElementById("nxt").disabled = true;
    }
    else document.getElementById("nxt").disabled = false;
}
function napuniCache(slike) {
    //console.log ("PUNJENJE CACHE-A");
    for (let i = 0; i < slike.length; i++) {
        slikeCache.push(slike[i]);
    }
    cachePointer = slikeCache.length - slike.length;
    // console.log ("Cache pointer(napuni slike):" + cachePointer);
    //  slikeCache = $.extend(slikeCache, slike);

    if (cachePointer != 0) document.getElementById("prev").disabled = false;

    //  console.log ("Cache pointer(sljedeci if): " + cachePointer +  "Glavni pointer(sljedeci if):" + pointer);

}

function prikaziSlike(listaSlika) {
    //console.log(listaSlika);
    let imgContent = "", targetDiv = document.getElementsByClassName("slike")[0];
    //targetDiv.innerHTML = "";
    for (let i = 0; i < listaSlika.length; i++) {
        imgContent += "<img src='" + listaSlika[i]["slika"] + "' alt='" + i + "slika'>\n";
    }
    targetDiv.innerHTML = imgContent;


}

function sljedeciCallBack(novaVelicina) {
    if (novaVelicina != -1 && novaVelicina != velicina) {
        alert("Dodane su nove slike u folder ili su obrisane. Refresham.");
        window.location.href = '/pocetna.html';
        return;
    }
    //ako postoji razlika velicine cache-a i foldera sa slikama te ako ce cache pointer izaci van opsega
    //ucitavamo nove url-ove 
    if (slikeCache.length != velicina && Math.abs(cachePointer - pointer) <= 3) {
        Pozivi.ucitajNoveSlike(pointer);
    }
    //ako ce cache pointer pokazivati na lokaciju unutar opsega to znaci da ucitavamo kroz cache
    else {
        let arr = [];
        cachePointer += 3;
        let pushAhead = cachePointer;
        //  console.log ("Cache pointer(sljedeci else): " + cachePointer +  "Glavni pointer(sljedeci else):" + pointer);
        for (let i = 0; i < 3 && pushAhead < slikeCache.length; i++)  arr.push(slikeCache[pushAhead++]);
        prikaziSlike(arr);
        if (cachePointer != 0) document.getElementById("prev").disabled = false;
        if (Math.abs(cachePointer - pointer) < 3 || (velicina % 3 == 0 && Math.abs(cachePointer - pointer) == 3 && velicina == pointer)) {
            //   console.log("Blokada ELSE sljedeci");
            document.getElementById("nxt").disabled = true;
        }
    }
}

function sljedeci() {
    /*Pozivi.provjeriBrojSlika su bili predvidjeni da detektuju da li se broj slika promjenio u folderu
    u skladu s tim se vrsi refresh stranice. Slao se AJAX zahtjev neovisno da li se ucitavalo iz cache-a ili sa servera (ne utjece na ucitavanje novih slika),
    ali da bi izbjegao eventualne nesporazume (da se ovaj AJAX zahtjev ne bi pogresno protumacio), maknuo sam ovu opciju
    sad je potrebno da se rucno refresha kad se doda  nova slika ili obrise*/
    // Pozivi.provjeriBrojSlika(true);   Zakomentarisan je za svaki slucaj
    sljedeciCallBack(-1);  //dodano umjesto Pozivi.provjeriBrojSlika(true);
}


function prethodniCallBack(novaVelicina) {
    if (novaVelicina != -1 && novaVelicina != velicina) {
        alert("Dodane su nove slike u folder ili su obrisane. Refresham.");
        window.location.href = '/pocetna.html';
        return;
    }

    if (document.getElementById("nxt").disabled) document.getElementById("nxt").disabled = false;
    cachePointer -= 3;
    let pushBackVal = cachePointer, arr = [];
    if (cachePointer <= 0) document.getElementById("prev").disabled = true;

    for (let i = 0; i < 3; i++)  arr.push(slikeCache[pushBackVal++]);
    prikaziSlike(arr);

}

function prethodni() {
    //Vrijedi isto objasnjenje kao u funkciji sljedeci()
    //  Pozivi.provjeriBrojSlika(false); Zakomentarisan za svaki slucaj
    prethodniCallBack(-1);   //dodano umjesto Pozivi.provjeriBrojSlika(false);
}

