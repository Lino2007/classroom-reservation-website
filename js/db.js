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
db.Osoblje = sequelize.import(__dirname+'/model/Osoblje.js');
db.Rezervacija = sequelize.import(__dirname+'/model/Rezervacija.js');
db.Termin = sequelize.import(__dirname+'/model/Termin.js');
db.Sala = sequelize.import(__dirname+'/model/Sala.js');

//definicija relacija
db.Osoblje.hasMany(db.Rezervacija, {  foreignKey : 'osoba'});
db.Rezervacija.belongsTo(db.Osoblje, {  foreignKey : 'osoba'});
db.Termin.hasOne(db.Rezervacija, {  foreignKey:{ name:'termin', type: Sequelize.INTEGER , unique: true}});
db.Rezervacija.belongsTo (db.Termin,  { as:'terminAssociation', foreignKey:{ name:'termin', type: Sequelize.INTEGER , unique: true}});
db.Sala.hasMany (db.Rezervacija, { foreignKey: 'sala' });
db.Rezervacija.belongsTo (db.Sala, { foreignKey: 'sala' , as: "salaAssociation"});
db.Osoblje.hasOne(db.Sala, {foreignKey: 'zaduzenaOsoba' });
db.Sala.belongsTo(db.Osoblje,  {foreignKey: 'zaduzenaOsoba' }); 

module.exports = db;


