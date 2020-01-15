const Sequelize = require("sequelize");

module.exports = function(sequelize,DataTypes){
    const Osoblje = sequelize.define("Osoblje",{
        ime:Sequelize.STRING,
        prezime:Sequelize.STRING,
        uloga:Sequelize.STRING
    })
    return Osoblje;
};