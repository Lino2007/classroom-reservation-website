let Pozivi= (function(){
    let periodicna=[], vanredna=[];
    function ucitajPodatkeIzJSON () {
        let jsonFile = new XMLHttpRequest();
        jsonFile.open("GET", "json/zauzeca.json", false);
        jsonFile.onreadystatechange = function ()
        {
            if(jsonFile.readyState === 4)
            {
                if(jsonFile.status === 200 || jsonFile.status == 0)
                {
                    let jsonObjekt = JSON.parse(jsonFile.responseText);
                    periodicna= jsonObjekt["periodicna"];
                    vanredna= jsonObjekt["vanredna"];
                }
            }
        }
        jsonFile.send(null);
    }

    window.onload = (event) => {
        var d = new Date();
        Kalendar.iscrtajKalendar(document.getElementById("datumi"), d.getMonth());
        ucitajPodatkeIzJSON();
        Kalendar.ucitajPodatke(periodicna, vanredna);
        Kalendar.ucitajPodatkeIzForme ();
    };
    
    function proslijediPodatke() {
       
       // confirm("Da li je sve ok?");
    }

    return {
        proslijediPodatkeImpl: proslijediPodatke
    }

}());