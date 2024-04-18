import connect from '../apis/connect' 
import { FETCH_PRODUCT_CATS, 
   POST_PRODUCT_CAT,SHOW_LOADER,HIDE_LOADER,
   POST_PRODUCT,FETCH_PRODUCTS,
    DELETE_PRODUCT,ADD_TO_CART, GET_CART,
     REMOVE_CART_ITEM, TOTAL_AMOUNT,FETCH_PRODUCT_BY_ID, ERROR,ORDER_PLACED, FETCH_ORDERS} from './types' 
import { reset, reduxForm } from "redux-form"; 
import history from '../history' 
import Cookies from 'js-cookie'; 
const FormData = require('form-data'); 

// Action creator for posting a product category
export const post_product_cat = (formValues) => async dispatch => {
   const formData = new FormData(); 
   
   formData.append("cat_name",formValues.cat_name) 
   formData.append("cat_image",formValues.cat_image) 
  

   var response = await connect.post('/add-product-category',formData, {
       headers: {
           'Content-Type': 'application/json',
           'authorization':Cookies.get('token') // Getting token from cookies
       },
     withCredentials:true,
   })
   console.log(response.data.status)
 
   if(response.data.success){ 
       dispatch({type:POST_PRODUCT_CAT,payload:response.data}) 
       dispatch(reset("add_product_cat")); 
   }
}   

// Action creator for fetching product categories
export const fetch_product_cats = () => async dispatch => {
   var response = await connect.get('/all-cats', {
       headers: {
           'Content-Type': 'application/json',
           'authorization':Cookies.get('token') // Getting token from cookies
       },
     withCredentials:true,
   })
   dispatch({type:FETCH_PRODUCT_CATS,payload:response.data}) // Dispatching FETCH_PRODUCT_CATS action with response data
   console.log(response.data.status)
}

// Action creator for posting a product
export const post_product = (formValues) => async dispatch => {
const formData = new FormData(); // Creating a new instance of FormData
   
formData.append("product_name",formValues.product_name) 
formData.append("product_quantity",formValues.product_quantity) 
formData.append("product_category_id",formValues.product_category_id.value) 
formData.append("product_price",formValues.product_price) 
formData.append("product_image_path",formValues.product_image_path) 

var response = await connect.post('/add-product',formData, {
       headers: {
           'Content-Type': 'application/json',
           'authorization':Cookies.get('token') // Getting token from cookies
       },
 withCredentials:true,
})

console.log('ADDING!!!!!!!!',response.data)
dispatch({type:POST_PRODUCT,payload:response.data}) // Dispatching POST_PRODUCT action with response data

if(response.data.success){ // If the response is successful
   dispatch(reset("ProductForm")); // Resetting the 'ProductForm' form
}
}

// Action creator for fetching all products
export const fetch_all_products = () => async dispatch => { 
   dispatch({type:SHOW_LOADER}) // Dispatching SHOW_LOADER action
   var response = await connect.get('/all-products', {
       headers: {
           'Content-Type': 'application/json',
           'authorization':Cookies.get('token') // Getting token from cookies
       },
     withCredentials:true,
   })
   console.log('-------->',response.data)
   if(response.status===200){ 
       dispatch({type:HIDE_LOADER}) 
   }
   dispatch({type:FETCH_PRODUCTS,payload:response.data}) // Dispatching FETCH_PRODUCTS action with response data
}

// Action creator for fetching a product by ID
export const fetch_product_by_id = (id) => async dispatch => {
   dispatch({type:SHOW_LOADER}) 
   var response = await connect.get('/get-product/'+id, {
       headers: {
           'Content-Type': 'application/json',
           'authorization':Cookies.get('token') // Getting token from cookies
       },
     withCredentials:true,
   })
   console.log('-------->',response.data)
   if(response!=null || response!='undefined' || response!=''){ // If the response is not null, undefined, or empty
       dispatch({type:HIDE_LOADER}) 
       if(response.status===200){ 
           dispatch({type:FETCH_PRODUCT_BY_ID,payload:response.data}) 
           history.push('/admin/edit-product/'+id) 
       }
   }
}

// Action creator for deleting a product
export const delete_product = (id) => async dispatch => { 
   console.log('DELTEING PRODUCT>>>>>>>>>>',id)
   var response = await connect.get('delete-product/'+id, {
       headers: {
           'Content-Type': 'application/json',
           'authorization':Cookies.get('token') // Getting token from cookies
       },
     withCredentials:true,
   })
   console.log('DELTEINGGGGGG ', response.data)
   
   dispatch({type:DELETE_PRODUCT,payload:id}) // Dispatching DELETE_PRODUCT action with product ID
}

// Action creator for adding a product to the cart
export const add_to_cart = (id) => async (dispatch,getState) => { 
  var data = {
       product_id:id 
   }
   var response = await connect.post('/add-to-cart',data, {
       headers: {
           'Content-Type': 'application/json',
           'authorization':Cookies.get('token') // Getting token from cookies
       },
     withCredentials:true,
   })

   if(response.status===200){ // If the response status is 200
       dispatch({type:ADD_TO_CART,payload:id}) 

       //calculate sum
       var sum=0; 
       getState().productReducer.cartItems.map(item=>{ 
           sum = sum+(item.product.product_price * item.quantity) 
       })
   
       dispatch({type:TOTAL_AMOUNT,payload:sum}) // Dispatching TOTAL_AMOUNT action with the calculated sum
   }
}

// Action creator for getting the cart
export const get_cart = (id) => async (dispatch,getState) => {
   var response = await connect.get('/get-cart', {
       headers: {
           'Content-Type': 'application/json',
           'authorization':Cookies.get('token') // Getting token from cookies
       },
     withCredentials:true,
   })

   if(response.status===200){ 
       dispatch({type:GET_CART,payload:response.data}) // Dispatching GET_CART action with response
   }}