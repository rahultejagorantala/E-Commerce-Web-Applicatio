var Sequelize = require('sequelize')
var sequelize = require('../utils/database')
module.exports = sequelize.define('product',{
    product_id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    product_category_id:{ 
        type:Sequelize.INTEGER,
    },
    product_name:{
        type:Sequelize.STRING,
        allowNull: false,
       
    },
    product_image_path:{
        type:Sequelize.STRING,
    },
    product_quantity:{
        type:Sequelize.INTEGER,
        default:0
    },
    product_vendor_id:{
        type:Sequelize.INTEGER,
    },
    product_price:{
        type:Sequelize.INTEGER,
        default:0 
    }


}
)