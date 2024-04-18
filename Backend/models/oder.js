var Sequelize = require('sequelize')
var sequelize = require('../utils/database')
module.exports = sequelize.define('order',{
    order_id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    order_status:{
        type:Sequelize.STRING,
        
        default:'processing'
    },
    order_amount:{
        type:Sequelize.INTEGER,
        default:0
    },
    cartItems:{
        type:Sequelize.JSON,
    },
    receipt_number:{
        type:Sequelize.TEXT,
    }


}
)