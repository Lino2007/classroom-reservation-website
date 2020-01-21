var Pozivi= (function(){
    var periodicna=[], vanredna=[];
    var zauzecaJsonObjekt; //JSON objekt u koji spremamo zauzeca.json
    const nizMjeseci = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'August', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];

// #region Spirala 4, Zadatak 1
    function dobaviPodatkeZaSelect () {
        $.get("/osoblje", function(data, status){
          return  ucitajSelectOsoblja(data);
          });
    }

    function dobaviSale () {
        $.get("/sale", function(data, status){
            return  ucitajSelectSala(data);
         });
    }
// #endregion
  

// #region Spirala 4, Zadatak 2 i 3


function ucitajIzBaze (param) {
        let jsonFile = new XMLHttpRequest();
        jsonFile.open("GET", "/zauzeca", true);
        jsonFile.onreadystatechange = function ()
        {
            if(jsonFile.readyState === 4)
            {
                if(jsonFile.status === 200 || jsonFile.status == 0)
                {
                    console.log(jsonFile.responseText);
                    zauzecaJsonObjekt = JSON.parse(jsonFile.responseText);
                   periodicna= zauzecaJsonObjekt["periodicna"];
                    vanredna= zauzecaJsonObjekt["vanredna"];
                     
                  
                    if (param) {
                    Kalendar.ucitajPodatke(vanredna, periodicna);
                    Kalendar.ucitajPodatkeIzForme ();
                    }
                    else {
                        slanjeTermina();
                    }
                }
            }
        } 
        jsonFile.send(null);
    }

  function posaljiTermin (podaci) {
       /* podaci["periodicna"]=zauzecaJsonObjekt["periodicna"];
        podaci["vanredna"]=zauzecaJsonObjekt["vanredna"]; */
     
        $.ajax({
            url: '/rezervacija',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(podaci),
            dataType: 'json',
            success:function(data) {
              if (data["valid"]) {
               
                ucitajIzBaze(true);
               }
               else {
                   alert(data["alert"]);
                   //ponovo refreshamo
                   ucitajIzBaze(true);
               }
              },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    }

    function dobaviPodatkeZaTabelu () {
        $.get("/osoblje_lokacija", function(data, status){
             return  ucitajTabelu(data);
            });
    }
// #endregion


// #region Spirala 3 zadatak 3
    function prvoUcitavanjeSlika () {
        let slike;
        let jsonDat = {   firstLoad : true };
      
        $.ajax({
            url: '/slike',
            type: 'POST',
            contentType: 'application/json',
            data:  JSON.stringify(jsonDat),
            dataType: 'json',
            success: function(data) {
            
                slike = data;
                postaviVelicinu(slike["velicina"]);
                postaviPointer (slike["ptr"]);
                napuniCache(slike["listURL"]);
                prikaziSlike(slike["listURL"]);

            } ,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(errorThrown);
                }
    });
         
    }

 function ucitajNoveSlike (pointer) {
       let slike;
       let jsonDat = {firstLoad: false , ptr: pointer};
       $.ajax({
        url: '/slike',
        type: 'POST',
        contentType: 'application/json',
        data:  JSON.stringify(jsonDat),
        dataType: 'json',
        success: function(data) {
            slike = data;
            postaviPointer (slike["ptr"]);
            napuniCache(slike["listURL"]);
            prikaziSlike(slike["listURL"]);

        } ,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(errorThrown);
         }
       }); 
}


    function provjeriBrojSlika (sljedeci) {
        let jsonDat = {};
        $.ajax({
            url: '/slike',
            type: 'POST',
            contentType: 'application/json',
            data:  JSON.stringify(jsonDat),
            dataType: 'json',
            success: function(data) {
                if (sljedeci)  sljedeciCallBack(data["novaVelicina"]);
                else prethodniCallBack(data["novaVelicina"]);
    
            } ,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(errorThrown);
             }
    });

    }  
// #endregion
 
    return {
         posaljiTermin,
         prvoUcitavanjeSlika,
         ucitajNoveSlike,
         provjeriBrojSlika,
         dobaviPodatkeZaSelect,
         ucitajIzBaze,
         dobaviPodatkeZaTabelu,
         dobaviSale
     }
 
 }());