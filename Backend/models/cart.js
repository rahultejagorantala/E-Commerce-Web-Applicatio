var Sequelize = require('sequelize')
var sequelize = require('../utils/database')
module.exports = sequelize.define('cart',{
    cart_id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    quantity:{
        type:Sequelize.INTEGER,
    
    }


}
)