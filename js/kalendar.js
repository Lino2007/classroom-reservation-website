let Kalendar = (function(){
    //
    //ovdje idu privatni atributi
    //
    
    function obojiZauzecaImpl(kalendarRef, mjesec, sala, pocetak, kraj){
    //implementacija ide ovdje
      
    }
    function ucitajPodatkeImpl(periodicna, redovna){
    //implementacija ide ovdje
    }
    function iscrtajKalendar(kalendarRef, mjesec){
    //implementacija ide ovdje
           
    }

   

   /* return {
    obojiZauzeca: obojiZauzecaImpl,
    ucitajPodatke: ucitajPodatkeImpl,
    iscrtajKalendar: iscrtajKalendarImpl
    } */
    }());
    //primjer korištenja modula
    //Kalendar.obojiZauzeca(document.getElementById(“kalendar”),1,”1-15”,”12:00”,”13:30”);
    const mapaMjeseca = new Map([
        ['Januar',  1], ['Februar',  4],['Mart',  4],  ['April',  7],  
        ['Maj',  2],  ['Juni',  5],  ['Juli',  7], ['August', 3] ,
        ['Septembar',  6],['Oktobar',  1],  ['Novembar',  4],  ['Decembar',  6]
    ]);
    let direction = 0;
    const nizMjeseci =  ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'August', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];
    function callPrev () {
        direction= -1;
        iscrtajKalendar(document.getElementById("datumi"),  document.getElementById("month"));
    }
    function callNext () {
        direction= 1;
        iscrtajKalendar(document.getElementById("datumi"),  document.getElementById("month"));
    }

    function daysInMonth (month, year) { 
        return new Date(year, month, 0).getDate(); 
    } 

    function iscrtajKalendar(kalendarRef, mjesec) {
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
    
            //pozovi farbanje
        
    }