const Sequelize = require("sequelize");

const sequelize = new Sequelize("DBWT19", "root", "root", {
   host: "localhost", // mysql-db
   dialect: "mysql",
   port:"3306",
   logging: false
});

const db = {};
db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//import modela
db.Osoblje = sequelize.import(__dirname+'/model/Osoblje.js');
db.Rezervacija = sequelize.import(__dirname+'/model/Rezervacija.js');
db.Termin = sequelize.import(__dirname+'/model/Termin.js');
db.Sala = sequelize.import(__dirname+'/model/Sala.js');

//definicija relacija
//termin -> rezervacija: 1:1
db.Termin.hasOne(db.Rezervacija, {  foreignKey:{ name:'termin', type: Sequelize.INTEGER , unique: true}});
db.Rezervacija.belongsTo (db.Termin,  { as:'terminAssociation', foreignKey:{ name:'termin', type: Sequelize.INTEGER , unique: true}});
//sala -> rezervacija: 1:n 
db.Sala.hasMany (db.Rezervacija, { foreignKey: 'sala' });
db.Rezervacija.belongsTo (db.Sala, { foreignKey: 'sala' , as: "salaAssociation"});
//osoblje -> rezervacija: 1:n
db.Osoblje.hasMany(db.Rezervacija, {  foreignKey : 'osoba'});
db.Rezervacija.belongsTo(db.Osoblje, {  foreignKey : 'osoba'});
//osoblje -> sala: 1:1
db.Osoblje.hasOne(db.Sala, {foreignKey: 'zaduzenaOsoba' });
db.Sala.belongsTo(db.Osoblje,  {foreignKey: 'zaduzenaOsoba' }); 

module.exports = db;

