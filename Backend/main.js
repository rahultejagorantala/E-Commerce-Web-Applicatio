//  require('dotenv').config();
const express = require('express')
const app = express()
const sequelizedb = require('./utils/database')
const bodyparser = require('body-parser')
const config = require('./config/config')
const api = require('./api/routes/api_get_data')
var cors = require('cors')


const corsOptions = {
    //To allow requests from client
   origin:["http://localhost:3000",
   "https://shoplyk.live"
],
   credentials: true   
  };
app.use(cors(corsOptions))

const path = require('path')
const multer = require('multer')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const USER = require('./models/user')
const CART = require('./models/cart')
const PRODUCT = require('./models/product')
const CATEGORY = require('./models/product_category')
const ORDER = require('./models/oder')

app.use(cookieParser())

        var today = new Date();
      var date = today.getFullYear()+(today.getMonth()+1)+today.getDate();
      var time = today.getHours()+ '-' +today.getMinutes() +'-'+ today.getSeconds();
      
const storageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, `${date}img${time}${file.originalname}`)
    }

})





app.use(express.static(path.join(__dirname, 'public')))
app.use('/public/uploads', express.static('./public/uploads'))
app.use(multer({ storage: storageEngine }).any())
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: false }))

app.use('/api', api)



//ASSOSICATIONS

PRODUCT.belongsTo(CATEGORY, {
    foreignKey: 'product_category_id',
    
})

CATEGORY.hasMany(PRODUCT, {
    foreignKey: 'product_category_id',
    
})



PRODUCT.belongsTo(USER, {
    foreignKey: 'product_vendor_id',
    onUpdate: 'cascade'
})

USER.hasMany(PRODUCT, {
    foreignKey: 'product_vendor_id',
    onUpdate: 'cascade'
})



CART.belongsTo(PRODUCT,{
    onUpdate: 'cascade',
    onDelete:'cascade',
   
})

PRODUCT.hasMany(CART,{
    onUpdate: 'cascade',
    onDelete:'cascade',
   
})



USER.hasMany(CART,{
    onUpdate: 'cascade',
    onDelete:'cascade'
})

CART.belongsTo(USER,{
    onUpdate: 'cascade',
    onDelete:'cascade'
})




USER.hasMany(ORDER,{
    onUpdate: 'cascade',
    onDelete:'cascade'
})


ORDER.belongsTo(USER,{
    onUpdate: 'cascade',
    onDelete:'cascade'
})




const PORT = process.env.PORT || 5000;
sequelizedb.sync().then(result => {
    app.listen(PORT, () => {
        console.log('server is running on ' + PORT)
    })
})

//{force:true}  