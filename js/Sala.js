const Sequelize = require("sequelize");

module.exports = function(sequelize,DataTypes){
    const Sala = sequelize.define("sala",{
        naziv:Sequelize.STRING
    })
    return Sala;
};