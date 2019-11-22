
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
           console.log (tabele.length);
            assert.equal (31, element.innerHTML, "Vrijednost zadnje celija tabele oktobra je vrijednosti 31");
        });

      it ('Pozivanje iscrtajKalendar za trenutni mjesec', function () {
        Kalendar.iscrtajKalendar (document.getElementById("datumi"), 10);
        let tabele =  document.getElementsByTagName("table")[0];
        let celija = tabele.getElementsByTagName("td");
        
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
         //petak je u petom TD-u kada prebrojimo, kada prebrojimo celije u html dokumentu od celije za mjesec novembar
        firstDay= firstDay.getDay()-1;
        assert.equal(celija[firstDay].text, 1, "Petak je prvi u mjesecu.");
           
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
