let Kalendar = (function () {
 
  const mapaMjeseca = new Map([
    ['Januar', 1], ['Februar', 4], ['Mart', 4], ['April', 7],
    ['Maj', 2], ['Juni', 5], ['Juli', 7], ['August', 3],
    ['Septembar', 6], ['Oktobar', 1], ['Novembar', 4], ['Decembar', 6]
  ]);
  const nizMjeseci = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'August', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];
  var redovnaZauzeca = [];
  var neperiodicnaZauzeca = [];
  var direction = 0, danZauzeca = -1, periodicniDan = -1;
  var trenutniMjesec, pocetak, kraj, opcija;

  function daLiJeLjetni(trenutniMjesec) {
    for (let i = 1; i <= 5; i++)
      if (trenutniMjesec == nizMjeseci[i]) return true;
    return false;
  }

  function daLiJeZimski(trenutniMjesec) {
    for (let i = 9; i <= 11; i++)
      if (trenutniMjesec == nizMjeseci[i]) return true;
    
      if (trenutniMjesec == nizMjeseci[0]) return true;
    return false;
  }

  function ucitajPodatkeIzForme() {
    pocetak = document.getElementById("pocetak").value;
    kraj = document.getElementById("kraj").value;
    opcija = document.getElementById("saleSelect").value;
    trenutniMjesec = document.getElementById("month").textContent;
    obojiZauzecaImpl(document.getElementById("datumi"), nizMjeseci.indexOf(trenutniMjesec), opcija, pocetak, kraj);
  }
 
  function dajMjesecIzObjekta(datum) {
    let arr = datum.split(".");
    return nizMjeseci[parseInt(arr[1]) - 1];
  }

  function dajDanIzObjekta(datum) {
    let arr = datum.split(".");
    return arr[0];
  }


  function preklapanjeVremena(poc, kr, pocetak, kraj) {
    if (pocetak >= kraj) return false;
    if ((poc >= pocetak && poc < kraj) || (kr > pocetak && kr <= kraj) || (poc <= pocetak && kr >= kraj))  return true;
     return false;
  }

  function resetujBoje(kalendarRef) {
    for (let i = 2, row; row = kalendarRef.rows[i], i < kalendarRef.rows.length; i++) {
      for (let j = 0, col; col = row.cells[j]; j++) {
        let sadrzajKolone = col.innerHTML;
        sadrzajKolone = sadrzajKolone.replace("zauzeta", "slobodna");
        col.innerHTML = sadrzajKolone;
      }
    }
  }

  function obojiZauzecaImpl(kalendarRef, mjesec, sala, pocetak, kraj) {
    this.pocetak = pocetak;
    this.kraj = kraj;
    resetujBoje(document.getElementById("datumi")); //resetovanje boja

    //obojenja za neperiodicna zauzeca
    for (let k = 0; k < neperiodicnaZauzeca.length; k++) {
          let objectMjesec = dajMjesecIzObjekta(neperiodicnaZauzeca[k].datum);
          danZauzeca = parseInt(dajDanIzObjekta(neperiodicnaZauzeca[k].datum));
         if (sala == neperiodicnaZauzeca[k].naziv) {
           if (mjesec == nizMjeseci.indexOf(objectMjesec) && preklapanjeVremena(neperiodicnaZauzeca[k].pocetak, neperiodicnaZauzeca[k].kraj, this.pocetak, this.kraj)) {
            let poz = mapaMjeseca.get(objectMjesec) + danZauzeca, counter = 1;

          for (let i = 2, row; row = kalendarRef.rows[i], i < kalendarRef.rows.length; i++) {
            for (let j = 0, col; col = row.cells[j]; j++ , counter++) {
                if (poz == counter) {
                col.innerHTML = "<td><table class=\"unutrasnja\"><tr><td>" + danZauzeca + "</td></tr><tr><td class=\"zauzeta\"></td></tr></table></td>";
              }
            }
          }
        }
      }
    }

    //obojenja za redovna zauzeca
    for (let k = 0; k < redovnaZauzeca.length; k++) {
        if (sala == redovnaZauzeca[k].naziv && ((redovnaZauzeca[k].semestar == "zimski" && daLiJeZimski(nizMjeseci[mjesec])) || (redovnaZauzeca[k].semestar == "ljetni" && daLiJeLjetni(nizMjeseci[mjesec])))) {
        periodicniDan = redovnaZauzeca[k].dan;
       if (preklapanjeVremena(redovnaZauzeca[k].pocetak, redovnaZauzeca[k].kraj, this.pocetak, this.kraj) && periodicniDan != -1) {
         for (let i = 2, row; row = kalendarRef.rows[i], i < kalendarRef.rows.length; i++) {
            for (let j = 0, col; col = row.cells[j]; j++) {
              if (col.textContent != "" && j == periodicniDan) {
              col.innerHTML = "<td><table class=\"unutrasnja\"><tr><td>" + col.textContent + "</td></tr><tr><td class=\"zauzeta\"></td></tr></table></td>";
              }
            }
          }
        }
      }
    }

  }


  function ucitajPodatkeImpl(periodicna, redovna) {
   
    neperiodicnaZauzeca = []; redovnaZauzeca = []; 

    resetujBoje(document.getElementById("datumi"));
    for (let i = 0; i < periodicna.length; i++) {
      neperiodicnaZauzeca.push(periodicna[i]);
    }
    for (let i = 0; i < redovna.length; i++) {
      redovnaZauzeca.push(redovna[i]);
    }

  }

  function iscrtajKalendarImpl(kalendarRef, mjesec) {

    var numberOfRows = kalendarRef.rows.length;
    var pozicija = mjesec;
    if ((direction == 1 && pozicija == 11) || (pozicija == 0 && direction == -1)) return;
    var daniMjesec = daysInMonth(pozicija + direction + 1, 2019)
    var nazivMjeseca = nizMjeseci[pozicija + direction];
    document.getElementById("month").textContent = nazivMjeseca;
    let dayCounter = 1, targetRow = kalendarRef.rows[2];
    targetRow.innerHTML = "";
    //crtanje dana u prvom redu
    for (var j = 0; j < 7; j++) {
      if (j >= mapaMjeseca.get(nazivMjeseca)) {
        targetRow.innerHTML += "<td><table class=\"unutrasnja\"><tr><td>" + dayCounter++ + "</td></tr><tr><td class=\"slobodna\"></td></tr></table></td>";
      }
      else {
        targetRow.innerHTML += "<td></td>";
      }

    }
   
    for (var i = 3, row; row = kalendarRef.rows[i], i < numberOfRows; i++) {
      for (var j = 0, col; col = row.cells[j]; j++ , dayCounter++) {
        if (dayCounter <= daniMjesec) {
          col.innerHTML = "<td><table class=\"unutrasnja\"><tr><td>" + dayCounter + "</td></tr><tr><td class=\"slobodna\"></td></tr></table></td>";
        }
        else {
          col.innerHTML = "<td></td>";
        }
      }
    }
    
    //ukoliko svi dani nisu u kalendaru a kapacitet je popunjen (dodajem novi red)
    if (dayCounter <= daniMjesec) {
      newRow = kalendarRef.insertRow(numberOfRows);
      newRow.innerHTML = "<tr class=\"red\"> <td></td><td></td><td></td> <td></td> <td></td><td></td><td></td></tr>";
      for (var j = 0, col; col = newRow.cells[j]; j++ , dayCounter++) {
        if (dayCounter <= daniMjesec) {
          col.innerHTML = "<td><table class=\"unutrasnja\"><tr><td>" + dayCounter + "</td></tr><tr><td class=\"slobodna\"></td></tr></table></td>";
        }
        else {
          col.innerHTML = "<td></td>";
        }
      }
    }
    direction = 0;
    ucitajPodatkeIzForme();
  }

  function callPrev() {
    direction = -1;
    var nazivMjeseca = document.getElementById("month").textContent;
    iscrtajKalendarImpl(document.getElementById("datumi"), nizMjeseci.indexOf(nazivMjeseca));
  }
  function callNext() {
    direction = 1;
    var nazivMjeseca = document.getElementById("month").textContent;
    iscrtajKalendarImpl(document.getElementById("datumi"), nizMjeseci.indexOf(nazivMjeseca));
  }

  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  /*var per = [


    {
      datum: "12.02.2019.",
      pocetak: "15:00",
      kraj: "17:00",
      naziv: "VA1",
      predavac: "Predavac 1"
    },
          {
            datum: "01.10.2019.",
            pocetak: "15:00",
            kraj: "17:00",
            naziv: "MA",
            predavac: "Predavac 1"
          }, 
          {
            datum: "12.10.2019.",
            pocetak: "15:00",
            kraj: "17:00",
            naziv: "MA",
            predavac: "Predavac 1"
          },
       {
            datum: "31.10.2019.",
            pocetak: "15:00",
            kraj: "17:00",
            naziv: "MA",
            predavac: "Predavac 1"
          },
       {
            datum: "30.10.2019.",
            pocetak: "10:00",
            kraj: "13:00",
            naziv: "MA",
            predavac: "Predavac 1"
          },
      {
            datum: "29.10.2019.",
            pocetak: "10:00",
            kraj: "13:00",
            naziv: "MA",
            predavac: "Predavac 1"
          },
          {
            datum: "20.02.2019.",
            pocetak: "10:00",
            kraj: "13:00",
            naziv: "VA1",
            predavac: "Predavac 1"
          },
          {
            datum: "21.11.2019.",
            pocetak: "15:00",
            kraj: "17:00",
            naziv: "VA1",
            predavac: "Predavac 1"
          } ,
          {
            datum: "31.12.2019.",
            pocetak: "15:00",
            kraj: "17:00",
            naziv: "VA1",
            predavac: "Predavac 1"
          } ,
          {
            datum: "01.12.2019.",
            pocetak: "15:00",
            kraj: "17:00",
            naziv: "VA1",
            predavac: "Predavac 1"
          }   
  
  ]; 
  var red = [
    {
      dan: 1,
      semestar: "zimski",
      pocetak: "15:00",
      kraj: "17:00",
      naziv: "VA1",
      predavac: "Predavac 1"
    },
    {
      dan: 3,
      semestar: "ljetni",
      pocetak: "15:00",
      kraj: "17:00",
      naziv: "VA1",
      predavac: "Predavac 1"
    },
    {
      dan: 6,
      semestar: "zimski",
      pocetak: "13:00",
      kraj: "14:00",
      naziv: "VA2",
      predavac: "Predavac 1"
    }];
  
  */
  /*window.onload = (event) => {
    var d = new Date();
    Kalendar.iscrtajKalendar(document.getElementById("datumi"), d.getMonth());
    Kalendar.ucitajPodatke(per, red);
    Kalendar.ucitajPodatkeIzForme ();
  }; */
  
  

 return {
    obojiZauzeca: obojiZauzecaImpl,
    ucitajPodatke: ucitajPodatkeImpl,
    iscrtajKalendar: iscrtajKalendarImpl,
    callPrev: callPrev,
    callNext: callNext,
    ucitajPodatkeIzForme: ucitajPodatkeIzForme
  }
}());

