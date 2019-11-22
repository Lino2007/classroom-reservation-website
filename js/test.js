
let assert = chai.assert;
describe('datumi', function() {
    describe ('iscrtajKalendar()' , function() {
             it ('Pozivanje iscrtajKalendar za mjesec sa 30 dana- mjesec juni', function () {
            //u mjesecu junu imamo 30 dana (zadnja nedjelja), pa bi zadnja celija trebala imati vrijednost 30
             Kalendar.iscrtajKalendar (document.getElementById("datumi"), 5);
           let tabele =  document.getElementsByTagName("table");
           let tabela = tabele[tabele.length-1];
           let element = tabela.querySelector ("tbody>tr>td");
            assert.equal (30, element.innerHTML, "Vrijednost zadnje celija tabele juna je vrijednosti 30");
        });

        it ('Pozivanje iscrtajKalendar za mjesec sa 31 dana- mjesec oktobar', function () {
           Kalendar.iscrtajKalendar (document.getElementById("datumi"), 9);
           let tabele =  document.getElementsByTagName("table");
           let tabela = tabele[tabele.length-1];
           let element = tabela.querySelector ("tbody>tr>td");
          // console.log (tabele.length);
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
 /*describe('crtaj()', function() {
   it('should draw 3 rows when parameter are 2,3', function() {
     Tabela.crtaj(2,3);
     let tabele = document.getElementsByTagName("table");
     let tabela = tabele[tabele.length-1]
     let redovi = tabela.getElementsByTagName("tr");
     assert.equal(redovi.length, 3,"Broj redova treba biti 3");
   });
   it('should draw 2 columns in row 2 when parameter are 2,3', function() {
       Tabela.crtaj(2,3);
       let tabele = document.getElementsByTagName("table");
       let tabela = tabele[tabele.length-1]
       let redovi = tabela.getElementsByTagName("tr");
       let kolone = redovi[2].getElementsByTagName("td");
       let brojPrikazanih = 0;
       for(let i=0;i<kolone.length;i++){
           let stil = window.getComputedStyle(kolone[i])
           if(stil.display!=='none') brojPrikazanih++;
       }
       assert.equal(brojPrikazanih, 2,"Broj kolona treba biti 2");
     });
 }); 
 
 describe('Kalendar', function() {
 describe('iscrtajKalendar()', function() {
   it('Pozivanje iscrtajKalendar za mjesec sa 30 dana - April (provjera redova)', function() {
     Kalendar.iscrtajKalendar(document.getElementsByClassName("cal")[0], 3);
     let tabele = document.getElementsByClassName("tabela1");
     let tabela = tabele[tabele.length-1];
     let brojRedova = tabela.querySelectorAll("body>div>table>tr");
     assert.equal(brojRedova.length, 8,"Broj redova treba biti 8");
   });
 
 
 
 */
});
