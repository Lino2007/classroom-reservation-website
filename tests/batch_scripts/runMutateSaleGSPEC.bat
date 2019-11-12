cd ..
call galen mutate mobileSale.gspec --url http://localhost/wt1918048/html/sale.html --size 1263x975 --htmlreport htmlreports/mobileSaleMutate-report
cd htmlreports/mobileSaleMutate-report
start report.html