cd ..
call galen mutate mobileUnos.gspec --url http://localhost/wt1918048/html/unos.html --size 1263x975 --htmlreport htmlreports/mobileUnosMutate-report
cd htmlreports/mobileUnosMutate-report
start report.html