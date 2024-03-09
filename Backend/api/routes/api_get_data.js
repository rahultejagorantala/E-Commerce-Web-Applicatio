const express  = require('express')
const router = express.Router()
const get_data_contoller = require('../controllers/get_data')
const verifytoken = require('../../middleware/verifytoken')
const isPermitted  = require('../../middleware/isPermitted')



router.post('/user-signup',get_data_contoller.user_signup)
router.post('/user-signin',get_data_contoller.user_signin)
router.get('/user-signout',get_data_contoller.user_signout)
router.post('/buy',verifytoken,get_data_contoller.buy_product)
router.post('/verify-order',verifytoken,get_data_contoller.verify_order)
router.get('/fetch-orders',verifytoken,get_data_contoller.fetch_orders)
router.post('/add-to-cart',verifytoken, get_data_contoller.add_to_cart)
router.get('/get-cart',verifytoken,get_data_contoller.get_cart)
router.post('/remove-cart-item',verifytoken,get_data_contoller.remove_cart_item)
router.get('/all-cats',get_data_contoller.get_all_cats)
router.get('/all-products',get_data_contoller.get_all_products)
router.get('/get-product/:id',get_data_contoller.get_product_by_id)

//ADMIN ROUTES
router.post('/edit-product', verifytoken, isPermitted(['admin']), get_data_contoller.edit_product)
router.post('/add-product-category', verifytoken, isPermitted(['admin']), get_data_contoller.add_product_category)
router.post('/add-product', verifytoken,isPermitted(['admin']),get_data_contoller.add_product)
router.get('/delete-product/:id',verifytoken, isPermitted(['admin']),get_data_contoller.delete_product)




module.exports =  router
