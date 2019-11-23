
let assert = chai.assert;
describe('datumi', function() {
    describe ('iscrtajKalendar()' , function() {
		
 	
		//Testovi za 2. zadatak
             it ('Pozivanje iscrtajKalendar za mjesec sa 30 dana- mjesec juni', function () {
            //u mjesecu junu imamo 30 dana (zadnja nedjelja), pa bi zadnja celija trebala imati vrijednost 30
             Kalendar.iscrtajKalendar (document.getElementById("datumi"), 5);
           let tabele =  document.getElementsByTagName("table");
           let tabela = tabele[tabele.length-1];
		   let element = tabela.querySelector ("tbody>tr>td");
		   console.log (element.innerHTML);
            assert.equal (30, element.innerHTML, "Vrijednost zadnje celija tabele juna je vrijednosti 30");
        });

        it ('Pozivanje iscrtajKalendar za mjesec sa 31 dana- mjesec oktobar', function () {
           Kalendar.iscrtajKalendar (document.getElementById("datumi"), 9);
           let tabele =  document.getElementsByTagName("table");
           let tabela = tabele[tabele.length-1];
           let element = tabela.querySelector ("tbody>tr>td");
        
            assert.equal (31, element.innerHTML, "Vrijednost zadnje celija tabele oktobra je vrijednosti 31");
        });

      it ('Pozivanje iscrtajKalendar za trenutni mjesec - provjera prvog dana', function () {
		    var date = new Date();
			Kalendar.iscrtajKalendar (document.getElementById("datumi"), date.getMonth());
        let tabele =  document.getElementsByTagName("table")[0];
		let red =  tabele.getElementsByClassName("red")[1];
        let celija = red.getElementsByTagName("td");  //cetvrti td u prvom redu mora imati vrijednost 1
        
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1); 
         /*vrijednost za petak se nalazi u petoj celiji (indexa 4) u SVAKOM redu (klase red), posto je getDay() = 5 onda je ocekivano da 
		  se trazeni sadrzaj nalazi u td indexa 4 (getDay()-1)
		ukoliko vrijeme pregledanja bude decembar onda ce na sestoj poziciji (nedjelja) biti prvi dan  (textcontext=1) */
       firstDay= firstDay.getDay()-1;
	
		assert.equal(celija[firstDay].textContent, 1, "Petak je prvi u mjesecu novembru ili nedjelja u mjesecu decembru (ovisno kad se spirala pregleda) .");
           
       });
	   
	   
	     it ('Pozivanje iscrtajKalendar za trenutni mjesec- provjera zadnjeg dana', function () {
		    var date = new Date();
			Kalendar.iscrtajKalendar (document.getElementById("datumi"), 10);
        let tabele =  document.getElementsByTagName("table")[0];
		let zadnjiRed = tabele.getElementsByClassName("red").length -1;
        let red = tabele.getElementsByClassName("red")[zadnjiRed];
		
		 //Uzimamo zadnji dan u mjesecu a to je subota (redni broj 6) u novembru, u tabeli brojanje pocinje od 0 tako da je lastDay()-1
		 var date= new Date();
         var lastDay = new Date(date.getFullYear(), date.getMonth()+1, 0);
		
        lastDay = lastDay.getDay()-1;
			//Unutrasnja je klasa tabelica u kojim se nalazi datum i obojen red
		var zadnjaCelija = red.getElementsByClassName("unutrasnja")[lastDay];
	     assert.equal( zadnjaCelija.textContent, 30, "Zadnji dan u trenutnom mjesecu je subota (30.).");
	 
       });
	   
	   
	   
	   it ('Pozivanje iscrtajKalendar za januar', function () {
		   
		Kalendar.iscrtajKalendar (document.getElementById("datumi"), 0);
        let tabele =  document.getElementsByTagName("table")[0];
		let celija = tabele.getElementsByClassName("red")[1];  //prvi red
		let zadnjiRed = tabele.getElementsByClassName("red").length -1 ;
		let brojCelija = tabele.getElementsByClassName("unutrasnja").length;
        
		//Broj unutrasnjih tabela mora biti 31
		assert.equal ( brojCelija , 31 , "Broj celija mora biti 31 obzirom da januar ima 31 dan.");
		//Provjeravam da li je prvi dan utorak (1 je index za utorak)
		celija= celija.getElementsByTagName("td")[1];
		assert.equal ( celija.textContent , 1 , "Prvi dan u mjesecu je utorak.");
		//Provjeravam da li je 31. u cetvrtak (za januar 2019), pristupam zadnjem redu 
		celija= tabele.getElementsByClassName("red")[zadnjiRed];
		//Celiji zadnjeg reda pristupam sa indeksom cetvrtka (3)
		celija= celija.getElementsByClassName("unutrasnja")[3];
        assert.equal ( celija.textContent, 31 , "Zadnji dan u mjesecu je četvrtak (31.)");
	   }); 
	  
	  it ('Pozivanje iscrtajKalendar za februar', function () { 
	    //Ocekivano: Ispravan naziv mjeseca ispisan u tabeli, februar ima 28 dana i predzadnji cetvrtak je 21.2
		  
	    Kalendar.iscrtajKalendar (document.getElementById("datumi"), 1);
        let tabele =  document.getElementsByTagName("table")[0];
		let nazivMjeseca = document.getElementById("month");  //id taga u kojem se nalazi naziv mjeseca
		
		let zadnjiRed = tabele.getElementsByClassName("red").length -1 ;
		let celija = tabele.getElementsByClassName("red")[zadnjiRed-1]; //predzadnji red
		let zadnjiDan = celija.getElementsByClassName("unutrasnja")[3];
		let brojCelija = tabele.getElementsByClassName("unutrasnja").length;
        
		assert.equal ( brojCelija , 28 , "Februar ima 28 dana.");
		assert.equal ( zadnjiDan.textContent , 21 , "Predzadnji cetvrtak je 21.");
        assert.equal ( nazivMjeseca.textContent, "Februar" , "Naziv mjeseca je februar");
	   }); 
	   
	   	  it ('Pozivanje iscrtajKalendar za mart', function () { 
	    //Ocekivano: Sve srijede su redom datumi 6., 13., 20. i 27.
		  
	    Kalendar.iscrtajKalendar (document.getElementById("datumi"), 1);
        let tabele =  document.getElementsByTagName("table")[0];
		let brojRed = tabele.getElementsByClassName("red").length-1;
        let nizDatuma = [0,0,6,13,20,27];
		for (let i=2 ; i<brojRed; i++) {
			let celija=  tabele.getElementsByClassName("red")[i];
			celija = celija.getElementsByClassName("unutrasnja");
			//2 srijeda
			assert.equal (celija[2].textContent, nizDatuma[i]);
		}
	   }); 
	   
	  });
	  
	   
	   
  
   
 describe ('obojiZauzeca()' , function() {
   
   //Testovi za 1. zadatak
		 it ('Pozivanje obojiZauzeca kada podaci nisu ucitani', function () {
			 Kalendar.iscrtajKalendar(document.getElementById("datumi"), 1);
			 Kalendar.obojiZauzeca(document.getElementById("datumi"), 1, "VA" , "05:00", "23:00");
			 
			  let tabele =  document.getElementsByTagName("table")[0];
			  let celije = tabele.getElementsByClassName("unutrasnja");
			  
			//provjeravam da li je svaka celija slobodna (obojena zeleno)
			 for (let i=0; i< celije.length ; i++) {
				 let obojenje= celije[i].getElementsByTagName("td")[1];
				 assert.equal(obojenje.className, "slobodna");
			 }
			 
		 }); 
		 
		  it ('Pozivanje obojiZauzeca gdje u zauzecima postoje duple vrijednosti istog termina', function () {
			  //duplicirani termini za isti period
			let dupliciraniTermini=[ {
            datum: "12.02.2019.",
            pocetak: "14:00",
            kraj: "15:00",
            naziv: "0-01",
            predavac: "Predavac 1"
            },
           {
           datum: "12.02.2019.",
           pocetak: "14:00",
           kraj: "15:00",
           naziv: "0-01",
           predavac: "Predavac 1"
           } ];
			 Kalendar.iscrtajKalendar(document.getElementById("datumi"), 1);
			 Kalendar.ucitajPodatke ( dupliciraniTermini, []);
			 Kalendar.obojiZauzeca(document.getElementById("datumi"), 1, "0-01" , "13:00", "15:00");
			 
			  let tabele =  document.getElementsByTagName("table")[0];
			  //index 11 je 12.02.
			  let celije = tabele.getElementsByClassName("unutrasnja")[11];
			  //provjeravam da li je celija zauzeta (obojena)
			  assert.equal (celije.getElementsByTagName("td")[1].className, "zauzeta");
			
			 
		 }); 
		 
		  it ('Pozivanje obojiZauzeca kada u podacima postoji periodicno zauzece za drugi semestar', function () {
			  //duplicirani termini za isti period
			let zauzeceDrugogSemestra=[ {
          dan: 1,
          semestar: "zimski",
          pocetak:  "9:00",
          kraj:  "14:00",
          naziv: "MA",
          predavac: "Predavac 1"
          }
           ];
			 Kalendar.iscrtajKalendar(document.getElementById("datumi"), 0);
			 Kalendar.ucitajPodatke ([], zauzeceDrugogSemestra);
			 Kalendar.obojiZauzeca(document.getElementById("datumi"), 0, "MA" , "09:00", "15:00");
			 //prvo provjeravam da li se boji zauzece u semestru u kojem se ono treba obojiti
			 //utorak je prvi u januaru i on se treba obojiti (jer je dan=1)
			 let tabele =  document.getElementsByTagName("table")[0];
		     let celije = tabele.getElementsByClassName("unutrasnja")[0];
			 assert.equal (celije.getElementsByTagName("td")[1].className, "zauzeta");
			 
			 //pokusavam isto u ljetnom semestru
			  Kalendar.iscrtajKalendar(document.getElementById("datumi"), 5);
			  Kalendar.obojiZauzeca(document.getElementById("datumi"), 5, "MA" , "09:00", "15:00");
			  
			  celije = tabele.getElementsByClassName("unutrasnja")[3];  //u junu utorak je 3.

              //provjeravam da li utorak u junu obojio			  
			 assert.equal (celije.getElementsByTagName("td")[1].className, "slobodna");
			
			 
		 }); 
		 
		 
		  it ('Pozivanje oboji zauzece kada u podacima postoji zauzece termina, ali u drugom mjesecu ', function () {
			 	let zauzeceDrugogMjeseca=[ 
		 {
          datum: "31.10.2019.",
          pocetak: "16:00",
          kraj: "18:00",
          naziv: "EE-1",
          predavac: "Predavac 1"
        },
		 {
          datum: "30.10.2019.",
          pocetak: "18:00",
          kraj: "18:45",
          naziv: "EE-1",
          predavac: "Predavac 1"
        }
           ];
			 Kalendar.iscrtajKalendar(document.getElementById("datumi"), 9);
			 Kalendar.ucitajPodatke ( zauzeceDrugogMjeseca , []);
			 Kalendar.obojiZauzeca(document.getElementById("datumi"), 9, "EE-1" , "17:00", "19:00");
			 //prvo provjeravam da li se boji zauzece u mjesecu oktobru
			 let tabele =  document.getElementsByTagName("table")[0];
		     let celije = tabele.getElementsByClassName("unutrasnja")[29];
			 let celije2= tabele.getElementsByClassName("unutrasnja")[30];
			 assert.equal (celije.getElementsByTagName("td")[1].className, "zauzeta");
			 assert.equal (celije2.getElementsByTagName("td")[1].className, "zauzeta");
			 
			 //pokusavam isto u ljetnom semestru
			  Kalendar.iscrtajKalendar(document.getElementById("datumi"), 5);
			  Kalendar.obojiZauzeca(document.getElementById("datumi"), 5, "EE-1" , "17:00", "19:00");
			  
			  celije = tabele.getElementsByClassName("unutrasnja");  

              //provjeravam da li su sve sale slobodne		  
			  for (let i=0; i< celije.length ; i++) {
				 let obojenje= celije[i].getElementsByTagName("td")[1];
				 assert.equal(obojenje.className, "slobodna");
			 }
			
			 
		 }); 
		 
		  it ('Pozivanje kada su u podacima svi termini u mjesecu zauzeti ', function () {

			let potpunoZauzece=[ 
			{
          dan: 0,
          semestar: "zimski",
          pocetak:  "9:00",
          kraj:  "14:00",
          naziv: "VA1",
          predavac: "Predavac 1"
          },
		 {
          dan: 1,
          semestar: "zimski",
          pocetak:  "9:00",
          kraj:  "14:00",
          naziv: "VA1",
          predavac: "Predavac 1"
          },
		 {
          dan: 2,
          semestar: "zimski",
          pocetak:  "9:00",
          kraj:  "14:00",
          naziv: "VA1",
          predavac: "Predavac 1"
          }
		  ,
		  {
          dan: 3,
          semestar: "zimski",
          pocetak:  "9:00",
          kraj:  "14:00",
          naziv: "VA1",
          predavac: "Predavac 1"
          },
		  {
          dan: 4,
          semestar: "zimski",
          pocetak:  "9:00",
          kraj:  "14:00",
          naziv: "VA1",
          predavac: "Predavac 1"
          }
		  ,
		  {
          dan: 5,
          semestar: "zimski",
          pocetak:  "9:00",
          kraj:  "14:00",
          naziv: "VA1",
          predavac: "Predavac 1"
          },
		  {
          dan: 6,
          semestar: "zimski",
          pocetak:  "9:00",
          kraj:  "14:00",
          naziv: "VA1",
          predavac: "Predavac 1"
          }
           ];
			 Kalendar.iscrtajKalendar(document.getElementById("datumi"), 9);
			 Kalendar.ucitajPodatke ( [], potpunoZauzece);
			 Kalendar.obojiZauzeca(document.getElementById("datumi"), 9, "VA1" , "01:00", "23:00");

			 let tabele =  document.getElementsByTagName("table")[0];
		     let celije = tabele.getElementsByClassName("unutrasnja"); 
			
		   //provjeravam da li su sve sale zauzete		  
			  for (let i=0; i< celije.length ; i++) {
				 let obojenje= celije[i].getElementsByTagName("td")[1];
				 assert.equal(obojenje.className, "zauzeta");
			 }
			 
		 }); 
		 
		 
		  it ('Dva puta uzastopno pozivanje obojiZauzece', function () {
			let potpunoZauzece=[ 
			{
          dan: 0,
          semestar: "zimski",
          pocetak:  "03:00",
          kraj:  "10:00",
          naziv: "VA1",
          predavac: "Predavac 1"
          }
           ];
			 Kalendar.iscrtajKalendar(document.getElementById("datumi"), 10);
			 Kalendar.ucitajPodatke ( [], potpunoZauzece);
			 Kalendar.obojiZauzeca(document.getElementById("datumi"), 10, "VA1" , "03:00", "11:20");

			 let tabele =  document.getElementsByTagName("table")[0];
			 let red = tabele.getElementsByClassName("red");
		     
			
		   //provjeravam da li su svi ponedjeljci zauzeti		  
			  for (let i=2; i< 6 ; i++) {
				 
				  let celije = red[i].getElementsByClassName("unutrasnja")[0]; 
				 
				 let obojenje= celije.getElementsByTagName("td")[1];
				 assert.equal(obojenje.className, "zauzeta");
			 }
			 //ponovni poziv
			  Kalendar.obojiZauzeca(document.getElementById("datumi"), 10, "VA1" , "03:00", "11:20");
			 
			   //ista provjera
			   for (let i=2; i< 6 ; i++) {
				 
				  let celije = red[i].getElementsByClassName("unutrasnja")[0]; 
				  
				 let obojenje= celije.getElementsByTagName("td")[1];
				 assert.equal(obojenje.className, "zauzeta");
			 }
		 }); 
		 
		 
		  it ('Pozivanje ucitajPodatke, obojiZazeca, ucitajPodatke (drugi podaci), obojiZauzeca ', function () {
		let zauzece1=[ 
			{
          datum: "01.08.2019.",
          pocetak: "10:30",
          kraj: "12:00",
          naziv: "VA2",
          predavac: "Predavac 1"
        }
           ];
		   
		   let zauzece2=[ 
			{
          datum: "05.08.2019.",
          pocetak: "10:30",
          kraj: "12:00",
          naziv: "VA2",
          predavac: "Predavac 1"
        }
           ];
			 Kalendar.iscrtajKalendar(document.getElementById("datumi"), 7);
			 Kalendar.ucitajPodatke ( zauzece1, []);
			 Kalendar.obojiZauzeca(document.getElementById("datumi"), 7, "VA2" , "10:00", "11:00");

			 let tabele =  document.getElementsByTagName("table")[0];
			 let celija = tabele.getElementsByClassName("unutrasnja")[0];
		     
			
		   //provjeravam da li je 1.8 zauzet  
			assert.equal (celija.getElementsByTagName("td")[1].className, "zauzeta");
			
			
			 Kalendar.iscrtajKalendar(document.getElementById("datumi"), 7);
			 Kalendar.ucitajPodatke ( zauzece2, []);
			 Kalendar.obojiZauzeca(document.getElementById("datumi"), 7, "VA2" , "10:00", "11:00");
			 celija = tabele.getElementsByClassName("unutrasnja")[4];
			 assert.equal (celija.getElementsByTagName("td")[1].className, "zauzeta");
			
		
		 }); 
		 
		 
		 it ('Pozivanje obojiZauzeca nad periodicnim i vanrednim zauzecima (overlap) ', function () {
			 //pozivam obojiZauzeca nad periodicnim i vanrednim zauzecima u istom vremenu
			 //ocekivano: presjek ova dva tipa zauzeca ne smije utjecati na finalno obojenje (mora ostati zauzeto)
				let zauzece1=[ 
				{
          dan: 1,
          semestar: "ljetni",
          pocetak:  "09:00",
          kraj:  "12:00",
          naziv: "VA2",
          predavac: "Predavac 1"
          }
           ];
		   
		   let zauzece2=[ 
			{
          datum: "06.08.2019.",
          pocetak: "09:00",
          kraj: "12:00",
          naziv: "VA2",
          predavac: "Predavac 1"
        }
           ];
			 Kalendar.iscrtajKalendar(document.getElementById("datumi"), 7);
			 Kalendar.ucitajPodatke ( zauzece2 , zauzece1);
			 Kalendar.obojiZauzeca(document.getElementById("datumi"), 7, "VA2" , "05:00", "11:00");

			 let tabele =  document.getElementsByTagName("table")[0];
			 let celija = tabele.getElementsByClassName("unutrasnja")[5];
		     
			
		   //provjeravam da li je 6.8 korektno obojen  
			assert.equal (celija.getElementsByTagName("td")[1].className, "zauzeta");
			
		
			
		
		 }); 
		 
		 
		  it ('Pozivanje obojiZauzeca nad periodicnim zauzecima za dva mjeseca istog semestra ', function () {
			 //pozivam obojiZauzeca nad periodicnim zauzecima 
			 //ocekivano: ukoliko je ljetni semestar onda ce oba mjeseca tog semestra biti obojena za specificirani dan
        let zauzece1=[ 
				{
          dan: 1,
          semestar: "ljetni",
          pocetak:  "09:00",
          kraj:  "12:00",
          naziv: "VA2",
          predavac: "Predavac 1"
          }
           ];
		    Kalendar.iscrtajKalendar(document.getElementById("datumi"), 7);
			 Kalendar.ucitajPodatke ( [] , zauzece1);
			 Kalendar.obojiZauzeca(document.getElementById("datumi"), 7, "VA2" , "05:00", "11:00");

		   
			 let tabele =  document.getElementsByTagName("table")[0];
			 let red = tabele.getElementsByClassName("red");
		     
			
		   //provjeravam da li su svi utorci zauzeti u augustu	  
			  for (let i=2; i< 6 ; i++) {
				 
				  let celije = red[i].getElementsByClassName("unutrasnja")[1]; 
				 
				 let obojenje= celije.getElementsByTagName("td")[1];
				 assert.equal(obojenje.className, "zauzeta");
			 }
			 
			 
			 Kalendar.iscrtajKalendar(document.getElementById("datumi"), 5);
			 Kalendar.obojiZauzeca(document.getElementById("datumi"), 5, "VA2" , "05:00", "11:00");
			 
			 //provjeravam da li su svi utorci zauzeti u junu  
			  for (let i=2; i< 6 ; i++) {
				 
				  let celije = red[i].getElementsByClassName("unutrasnja")[1]; 
				 
				 let obojenje= celije.getElementsByTagName("td")[1];
				  assert.equal(obojenje.className, "zauzeta");
			  }
		
		
		 }); 
		 
	});
   
});
