var Pozivi= (function(){
    var periodicna=[], vanredna=[];
    var zauzecaJsonObjekt; //JSON objekt u koji spremamo zauzeca.json
    function ucitajPodatkeIzJSON () {
        let jsonFile = new XMLHttpRequest();
        jsonFile.open("GET", "json/zauzeca.json", false);
        jsonFile.onreadystatechange = function ()
        {
            if(jsonFile.readyState === 4)
            {
                if(jsonFile.status === 200 || jsonFile.status == 0)
                {
                    zauzecaJsonObjekt = JSON.parse(jsonFile.responseText);
                   periodicna= zauzecaJsonObjekt["periodicna"];
                    vanredna= zauzecaJsonObjekt["vanredna"];
                }
            }
        }
        jsonFile.send(null);
        return arr= [periodicna, vanredna];
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
            error: function (x,y,z) {
              console.log(x);
              console.log(y);
              console.log(z);
            }
        });
    }

    function tvt () {
        console.log("tvt is here");
    }
 
     return {
         ucitajPodatkeIzJSON,
         posaljiTermin,
         tvt
     }
 
 }());