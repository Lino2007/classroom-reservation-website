const Sequelize = require("sequelize");

module.exports = function(sequelize,DataTypes){
    const Termin = sequelize.define("Termin",{
        redovni:Sequelize.BOOLEAN,
        dan:Sequelize.INTEGER,
        datum:Sequelize.STRING,
        semestar:Sequelize.STRING,
        pocetak:Sequelize.TIME,
        kraj:Sequelize.TIME
    })
    return Termin;
};