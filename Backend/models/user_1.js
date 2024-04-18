var Sequelize = require('sequelize')
var sequelize = require('../utils/database')
module.exports = sequelize.define('user',{
    user_id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },

    user_password:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    user_gender:{ 
        type:Sequelize.STRING,
        allowNull: false,
    },
    user_email:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    user_phone:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    user_address:{
     type:Sequelize.STRING,
     allowNull: false,
   },
   user_role:{
    type:Sequelize.STRING,
    default:"customer"
   },
   user_token:{
    type:Sequelize.STRING,
   
   },
   
    
}
)


