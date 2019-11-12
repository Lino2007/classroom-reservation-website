cd ..
call galen check mobileSale.gspec --url http://localhost/wt1918048/html/sale.html --size 1263x975 --htmlreport htmlreports/mobileSale-report
cd htmlreports/mobileSale-report
start report.html