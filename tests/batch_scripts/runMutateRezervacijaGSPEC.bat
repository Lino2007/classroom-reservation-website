cd ..
call galen mutate mobileRezervacija.gspec --url http://localhost/wt1918048/html/rezervacija.html --size 1263x975 --htmlreport htmlreports/mobileRezervacijaMutate-report
cd htmlreports/mobileRezervacijaMutate-report
start report.html