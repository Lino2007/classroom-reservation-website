const Sequelize = require("sequelize");

module.exports = function(sequelize,DataTypes){
    const Termin = sequelize.define("termin",{
        redovni:Sequelize.BOOLEAN,
        dan:Sequelize.INTEGER,
        datum:Sequelize.STRING,
        semestar:Sequelize.INTEGER,
        pocetak:Sequelize.TIME,
        kraj:Sequelize.TIME
    })
    return Termin;
};