var Sequelize = require('sequelize')
var sequelize = require('../utils/database')
module.exports = sequelize.define('categories',{
    cat_id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    cat_name:{
        type:Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    cat_image_path:{
        type:Sequelize.STRING,
        allowNull: false,
    }

}
)