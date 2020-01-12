
const Sequelize = require("sequelize");
const sequelize = new Sequelize("DBWT19", "root", "root", {
   host: "127.0.0.1",
   dialect: "mysql",
   port:"3308"
});
const db = {};
db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//import modela
db.osoblje = sequelize.import(__dirname+'/Osoblje.js');
db.rezervacija = sequelize.import(__dirname+'/RezervacijaModel.js');
db.termin = sequelize.import(__dirname+'/Termin.js');
db.sala = sequelize.import(__dirname+'/Sala.js');

//definicija relacija
db.rezervacija.belongsTo( db.osoblje, {foreignKey: 'osoba'});
db.rezervacija.belongsTo (db.termin , {as:'termin',foreignKey:{ name:'terminFK', type: Sequelize.INTEGER , unique: 'compositeIndex'}});
db.rezervacija.belongsTo (db.sala, {as:'sala',foreignKey: 'salaFK'});
db.sala.belongsTo(db.osoblje, {foreignKey: 'zaduzenaOsoba'});


module.exports = db;


