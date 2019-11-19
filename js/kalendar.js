
let Kalendar = (function(){
    var promjenaKalendara = false;
    const mapaMjeseca = new Map([
        ['Januar',  1], ['Februar',  4],['Mart',  4],  ['April',  7],  
        ['Maj',  2],  ['Juni',  5],  ['Juli',  7], ['August', 3] ,
        ['Septembar',  6],['Oktobar',  1],  ['Novembar',  4],  ['Decembar',  6]
    ]);
    //Obzirom da se date funkcija ponasa jako cudno kad su u pitanju zadnji dani u mjesecu dodana je pomocna mapa
    const zadnjiDanUMjesecu = new Map([
        ['Januar',  31], ['Februar',  28],['Mart',  31],  ['April',  30],  
        ['Maj',  31],  ['Juni',  30],  ['Juli',  31], ['August', 31] ,
        ['Septembar',  30],['Oktobar',  31],  ['Novembar',  30],  ['Decembar',  31]
    ]);
    var direction = 0, danZauzeca = -1, periodicniDan=-1;
    var trenutniMjesec, pocetak, kraj, opcija;
   const nizMjeseci =  ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'August', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];
   var periodic= false, refresh = false;
    var redovnaZauzeca = [
        {
            dan: 1,
            semestar: "zimski",
            pocetak:  "12:00",
            kraj:  "14:00",
            naziv: "MA",
            predavac: "Predavac 1"
            },
            {
                dan: 3,
                semestar: "zimski",
                pocetak:  "13:00",
                kraj:  "14:00",
                naziv: "VA",
                predavac: "Predavac 1"
                } ,
                {
                    dan: 6,
                    semestar: "ljetni",
                    pocetak:  "13:00",
                    kraj:  "14:00",
                    naziv: "VA",
                    predavac: "Predavac 1"
                    }
            
    ];

     var periodicnaZauzeca = [
          {
            datum: "12.02.2019.",
            pocetak: "15:00",
            kraj: "17:00",
            naziv: "MA",
            predavac: "Predavac 1"
          },
          {
            datum: "01.10.2019.",
            pocetak: "9:00",
            kraj: "11:00",
            naziv: "MA",
            predavac: "Predavac 1"
          }, 
          {
            datum: "12.10.2019.",
            pocetak: "10:00",
            kraj: "13:00",
            naziv: "MA",
            predavac: "Predavac 1"
          },
          {
            datum: "20.02.2019.",
            pocetak: "10:00",
            kraj: "13:00",
            naziv: "MA",
            predavac: "Predavac 1"
          },
          {
            datum: "21.12.2019.",
            pocetak: "10:00",
            kraj: "13:00",
            naziv: "VA",
            predavac: "Predavac 1"
          } ,
          {
            datum: "31.12.2019.",
            pocetak: "10:00",
            kraj: "13:00",
            naziv: "VA",
            predavac: "Predavac 1"
          } ,
          {
            datum: "01.12.2019.",
            pocetak: "10:00",
            kraj: "13:00",
            naziv: "VA",
            predavac: "Predavac 1"
          }  
          
          ];
    
         function daLiJeLjetni (trenutniMjesec) {
             for (let i=2; i<=8; i++) 
                   if (trenutniMjesec==nizMjeseci[i]) return true;
             return false;
         }
              
             function ucitajPodatkeIzForme () {
               
                pocetak = document.getElementById("pocetak").value;
                kraj = document.getElementById("kraj").value;
                opcija = document.getElementById("saleSelect").value;
                trenutniMjesec= document.getElementById("month").textContent;
             
                ucitajPodatkeImpl(periodicnaZauzeca, redovnaZauzeca);
               }
    
             function dajMjesecIzObjekta (datum) {
                let arr = datum.split(".");
                 return nizMjeseci[parseInt(arr[1])-1];
             }

             function dajDanIzObjekta (datum) {
                let arr = datum.split(".");
                return arr[0];
             }
              
          
             function preklapanjeVremena (poc, kr) {
               
                    if ((poc >= pocetak && poc<=kraj) || (kr>= pocetak && kr<=kraj)) return true;
                    return false;
             } 

             function resetujBoje (kalendarRef) {
                for (let i = 2, row ; row = kalendarRef.rows[i] , i<kalendarRef.rows.length; i++) {
                    for (let j = 0, col; col = row.cells[j] ; j++) {
                        let sadrzajKolone = col.innerHTML;
                        sadrzajKolone=sadrzajKolone.replace("zauzeta", "slobodna");
                        col.innerHTML=sadrzajKolone;
                    }
                }  
             }
        
            function obojiZauzecaImpl(kalendarRef, mjesec, sala, pocetak, kraj){
          //    console.log("Usao sam sa podacima"  +  kalendarRef + " " + mjesec + " "+ sala + " " + pocetak + " " + kraj);
          console.log (mjesec);
             if (opcija==sala && periodic==true) {
                    
                     if (mjesec== trenutniMjesec && preklapanjeVremena(pocetak, kraj) ) {
                        let poz = mapaMjeseca.get(mjesec) + danZauzeca, counter=1;
                       
                        for (let i = 2, row ; row = kalendarRef.rows[i] , i<kalendarRef.rows.length; i++) {
                            for (let j = 0, col; col = row.cells[j] ; j++ , counter++ ) {
  
                               if (poz==counter)  {
                                 col.innerHTML= "<td><table class=\"unutrasnja\"><tr><td>"+ danZauzeca +"</td></tr><tr><td class=\"zauzeta\"></td></tr></table></td>"; 
                                    return ;
                                }
                            }  
                        }
                         
                   } 
                
               }
            
            if (opcija==sala && periodic!=true) {
                if (preklapanjeVremena(pocetak, kraj) && periodicniDan!=-1 ) {
                  for (let i = 2, row ; row = kalendarRef.rows[i] , i<kalendarRef.rows.length; i++) {
                       for (let j = 0, col; col = row.cells[j] ; j++ ) {
                          if (col.textContent!="" && j==periodicniDan) {
                            col.innerHTML= "<td><table class=\"unutrasnja\"><tr><td>"+ col.textContent +"</td></tr><tr><td class=\"zauzeta\"></td></tr></table></td>"; 
                          }
                       }  
                   }
                    
              } 
            }

             }

             //---------------------------------------------------
                function ucitajPodatkeImpl(periodicna, redovna){
                   periodic=true;
                   
                /*  if(!(promjenaKalendara))  */ /*iscrtajKalendarImpl(document.getElementById("datumi"),document.getElementById("month") );  */ //refresh boja
                     resetujBoje(document.getElementById("datumi"));
                    for (let i =0; i<periodicna.length; i++) {
                          let objectMjesec = dajMjesecIzObjekta(periodicna[i].datum); 
                          danZauzeca =  parseInt(dajDanIzObjekta(periodicna[i].datum));
                          obojiZauzecaImpl(document.getElementById("datumi"), objectMjesec,  periodicnaZauzeca[i].naziv, periodicnaZauzeca[i].pocetak, periodicnaZauzeca[i].kraj);
                     }
                          periodic=false;
                    
                     for (let i =0; i<redovna.length; i++) {
                             if ((redovna[i].semestar=="zimski" && !(daLiJeLjetni(trenutniMjesec))) || (redovna[i].semestar=="ljetni" && daLiJeLjetni(trenutniMjesec))) {
                                 periodicniDan= redovna[i].dan;
                                 obojiZauzecaImpl(document.getElementById("datumi"), document.getElementById("month"),  redovna[i].naziv, redovna[i].pocetak, redovna[i].kraj);
                            }
                    }
                     periodicniDan=-1;
                    }

                function iscrtajKalendarImpl(kalendarRef, mjesec) {
                 
                    var nazivMjeseca= mjesec.textContent, numberOfRows = kalendarRef.rows.length;
                    var pozicija=nizMjeseci.indexOf(nazivMjeseca) ;
                    if ((direction==1 && pozicija==11) || (pozicija==0 && direction==-1)) return ;
                    var daniMjesec = daysInMonth(pozicija+direction+1, 2019)
                    nazivMjeseca= nizMjeseci[pozicija+direction];
                    mjesec.textContent=nazivMjeseca;
                    let dayCounter= 1 , targetRow = kalendarRef.rows[2];
                    targetRow.innerHTML="";
                     for (var j=0 ; j<7 ; j++) {
                         if (j>=mapaMjeseca.get(nazivMjeseca)) {
                                      targetRow.innerHTML+= "<td><table class=\"unutrasnja\"><tr><td>"+ dayCounter++ +"</td></tr><tr><td class=\"slobodna\"></td></tr></table></td>";
                                  }
                                  else {
                                    targetRow.innerHTML+= "<td></td>";
                                  }
                             
                    }
                     
                    for (var i = 3, row ; row = kalendarRef.rows[i] , i<numberOfRows; i++) {
                         for (var j = 0, col; col = row.cells[j] ; j++ , dayCounter++) {
                             if (dayCounter<= daniMjesec)  {
                            col.innerHTML= "<td><table class=\"unutrasnja\"><tr><td>"+ dayCounter +"</td></tr><tr><td class=\"slobodna\"></td></tr></table></td>"; 
                             }
                             else {
                                col.innerHTML= "<td></td>"; 
                             }
                        }  
                     }
                    
                      if (dayCounter<daniMjesec) {
                         newRow= kalendarRef.insertRow (numberOfRows);
                         newRow.innerHTML = "<tr class=\"red\"> <td></td><td></td><td></td> <td></td> <td></td><td></td><td></td></tr>";
                        for (var j = 0, col; col = newRow.cells[j] ; j++, dayCounter++) {
                            if (dayCounter<= daniMjesec)  {
                                col.innerHTML= "<td><table class=\"unutrasnja\"><tr><td>"+ dayCounter +"</td></tr><tr><td class=\"slobodna\"></td></tr></table></td>"; 
                                 }
                                 else {
                                    col.innerHTML= "<td></td>"; 
                                 }
                        }  
                     }
                     direction=0;
                     ucitajPodatkeIzForme();
                    }
    
                    function callPrev () {
                        direction= -1;
                        promjenaKalendara= true;
                        iscrtajKalendarImpl(document.getElementById("datumi"),  document.getElementById("month"));
                    }
                    function callNext () {
                        direction= 1;
                        promjenaKalendara= true;
                        iscrtajKalendarImpl(document.getElementById("datumi"),  document.getElementById("month"));
                    }
                
                    function daysInMonth (month, year) { 
                        return new Date(year, month, 0).getDate(); 
                    } 

   

   return {
    obojiZauzeca: obojiZauzecaImpl,
    ucitajPodatke: ucitajPodatkeImpl,
    iscrtajKalendar: iscrtajKalendarImpl,
    callPrev : callPrev,
    callNext : callNext,
    ucitajPodatkeIzForme :ucitajPodatkeIzForme
    } 
    }());
    //primjer korištenja modula
    //Kalendar.obojiZauzeca(document.getElementById(“kalendar”),1,”1-15”,”12:00”,”13:30”);

  
   
 window.onload = (event) => {
   
 Kalendar.iscrtajKalendar(document.getElementById("datumi"), document.getElementById("month"));
};
   

  