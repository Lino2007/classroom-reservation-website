var Pozivi= (function(){
  
    function ucitajPodatkeIzJSON () {
        let periodicna=[], vanredna=[];
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
        return arr= [periodicna, vanredna];
    }
  
    function posaljiTermin (podaci) {
        $.ajax({
            url: '/rezervacija',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(podaci),
            dataType: 'json',
            error: function (x,y,s) {
              console.log("err");
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