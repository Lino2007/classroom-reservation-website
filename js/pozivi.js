var Pozivi= (function(){
    var periodicna=[], vanredna=[];
    var zauzecaJsonObjekt; //JSON objekt u koji spremamo zauzeca.json
    function ucitajPodatkeIzJSON () {

      
        let jsonFile = new XMLHttpRequest();
        jsonFile.open("GET", "json/zauzeca.json", true);
        jsonFile.onreadystatechange = function ()
        {
            if(jsonFile.readyState === 4)
            {
                if(jsonFile.status === 200 || jsonFile.status == 0)
                {
                    zauzecaJsonObjekt = JSON.parse(jsonFile.responseText);
                   periodicna= zauzecaJsonObjekt["periodicna"];
                    vanredna= zauzecaJsonObjekt["vanredna"];
                    console.log("Dobar dan");
                    Kalendar.ucitajPodatke(vanredna, periodicna);
                    Kalendar.ucitajPodatkeIzForme ();
                }
            }
        } /////
        jsonFile.send(null);
        //return arr= [periodicna, vanredna];
    }
  
    function posaljiTermin (podaci) {
        //ucitavam i sve termine da ne moram opet otvarati zauzeca.json
        podaci["periodicna"]=zauzecaJsonObjekt["periodicna"];
        podaci["vanredna"]=zauzecaJsonObjekt["vanredna"];
       
        $.ajax({
            url: '/rezervacija',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(podaci),
            dataType: 'json',
            success:function(data) {
              
               if (data["valid"]) {
               zauzecaJsonObjekt["periodicna"] = data["periodicnaZauzeca"];
               zauzecaJsonObjekt["vanredna"]= data["vanrednaZauzeca"];
               Kalendar.ucitajPodatke(zauzecaJsonObjekt["vanredna"],  zauzecaJsonObjekt["periodicna"] );
               Kalendar.ucitajPodatkeIzForme ();
               }
               else {
                   alert(data["alert"]);
               }
              }
              ,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            /* var text = (XMLHttpRequest.responseText).getTagById("pre").innerHTML;
             console.log (text);
             alert(XMLHttpRequest.responseText); */
            }
        });
    }

    function prvoUcitavanjeSlika () {
        let slike;
        let jsonDat = {   firstLoad : true };
      
        $.ajax({
            url: '/pocetna',
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
                /* var text = (XMLHttpRequest.responseText).getTagById("pre").innerHTML;
                 console.log (text);
                 alert(XMLHttpRequest.responseText); */
                }
    });
         
    }



    function ucitajNoveSlike (pointer) {
     
       let slike;
       let jsonDat = {firstLoad: false , ptr: pointer};
       $.ajax({
        url: '/pocetna',
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
}); }

     return {
         ucitajPodatkeIzJSON,
         posaljiTermin,
         prvoUcitavanjeSlika,
         ucitajNoveSlike
     }
 
 }());