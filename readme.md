# Classroom reservation website
This is my first web application as a part of the faculty project on the subject "Web technologies" (3rd year Bachelor). Used technologies:

 - HTML 
 - CSS
 - Node.js (with Express.js)
 - MySQL/PostgreSQL 

Both frontend and backend were tested with Galen and Mocha + Chai frameworks respectively.

The application allows user (professor or teaching assistant) to reserve classroom or check who reserved classroom (Rezervacije page) and also see in real-time who is using specific classroom (Osobe page).  The rest of pages don't have any functionalities since the intention of the project was also to teach us basic HTML and CSS concepts.



 

## App prerequisites and startup
The application requires following:

 1. Installed [PostgreSQL](https://www.postgresql.org/download/)  and [Node](https://nodejs.org/en/download/) 
 2. Created database named **dbwt19** in PostgreSQL


To run application:
 1. Clone the project
 2. Position to *js* directory and run `npm install`
 3. After successful installation run `node index.js`
 4. The application will be available at `http://localhost:8080`
 



## Tips and hints

 - To reserve site visit *Reservation* page, enter all required details first and click on available date (green section). 
![Reservation](https://i.imgur.com/gNfuEDo.png)

- Periodic reservation will reserve classroom for every week at selected time and all months of specific semester. E.g. if you make periodic reservation in October, a classroom will be reserved for winter semester months (October, November and December).
