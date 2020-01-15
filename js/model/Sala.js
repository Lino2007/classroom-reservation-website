const Sequelize = require("sequelize");

module.exports = function(sequelize,DataTypes){
    const Sala = sequelize.define("Sala",{
        naziv:Sequelize.STRING
    })
    return Sala;
};