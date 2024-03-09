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


export const post_product_cat = (formValues) => async dispatch => {
   

    const formData = new FormData();
    
    formData.append("cat_name",formValues.cat_name)
    formData.append("cat_image",formValues.cat_image)
   

    var response = await connect.post('/add-product-category',formData, {
        
        headers: {
            'Content-Type': 'application/json',
            'authorization':Cookies.get('token')
        },
      withCredentials:true,
      
    })
    console.log(response.data.status)
  
    if(response.data.success){ 
        dispatch({type:POST_PRODUCT_CAT,payload:response.data})
        dispatch(reset("add_product_cat"));
    }
   
    
}   


export const fetch_product_cats = () => async dispatch => {

    var response = await connect.get('/all-cats', {
        
        headers: {
            'Content-Type': 'application/json',
            'authorization':Cookies.get('token')
        },
      withCredentials:true,
      
    })
    dispatch({type:FETCH_PRODUCT_CATS,payload:response.data})
    console.log(response.data.status)
}


export const post_product = (formValues) => async dispatch => {
const formData = new FormData();
    
formData.append("product_name",formValues.product_name)
formData.append("product_quantity",formValues.product_quantity)
formData.append("product_category_id",formValues.product_category_id.value)
formData.append("product_price",formValues.product_price)
formData.append("product_image_path",formValues.product_image_path)


var response = await connect.post('/add-product',formData, {
        
    headers: {
        'Content-Type': 'application/json',
        'authorization':Cookies.get('token')
    },
  withCredentials:true,
  
})

console.log('ADDING!!!!!!!!',response.data)
dispatch({type:POST_PRODUCT,payload:response.data})

if(response.data.success){
    dispatch(reset("ProductForm"));
}

}

export const fetch_all_products = () => async dispatch => { 
    dispatch({type:SHOW_LOADER})
    var response = await connect.get('/all-products', {
        
        headers: {
            'Content-Type': 'application/json',
            'authorization':Cookies.get('token')
        },
      withCredentials:true,
      
    })
    console.log('-------->',response.data)
    if(response.status===200){
        dispatch({type:HIDE_LOADER})
    }
    dispatch({type:FETCH_PRODUCTS,payload:response.data})
   


}

export const fetch_product_by_id = (id) => async dispatch => {
    dispatch({type:SHOW_LOADER})
    var response = await connect.get('/get-product/'+id, {
        
        headers: {
            'Content-Type': 'application/json',
            'authorization':Cookies.get('token')
        },
      withCredentials:true,
      
    })
    console.log('-------->',response.data)
    if(response!=null || response!='undefined' || response!=''){
        dispatch({type:HIDE_LOADER})
        if(response.status===200){
            dispatch({type:FETCH_PRODUCT_BY_ID,payload:response.data})
            history.push('/admin/edit-product/'+id)
        }
    }
   
    
}

export const delete_product = (id) => async dispatch => { 
    console.log('DELTEING PRODUCT>>>>>>>>>>',id)
    var response = await connect.get('delete-product/'+id, {
        
        headers: {
            'Content-Type': 'application/json',
            'authorization':Cookies.get('token')
        },
      withCredentials:true,
      
    })
    console.log('DELTEINGGGGGG ', response.data)
    
    dispatch({type:DELETE_PRODUCT,payload:id})
}


export const add_to_cart = (id) => async (dispatch,getState) => { 
   
   var data = {
        
        product_id:id
    }
    var response = await connect.post('/add-to-cart',data, {
        
        headers: {
            'Content-Type': 'application/json',
            'authorization':Cookies.get('token')
        },
      withCredentials:true,
      
    })

    if(response.status===200){
        dispatch({type:ADD_TO_CART,payload:id})

        //calculate sum
        var sum=0;
 
   
        getState().productReducer.cartItems.map(item=>{
            sum = sum+(item.product.product_price * item.quantity)
        })
    
   
   
    dispatch({type:TOTAL_AMOUNT,payload:sum})


    }
   
   
}

export const get_cart = (id) => async (dispatch,getState) => {


   
    var response = await connect.get('/get-cart', {
        
        headers: {
            'Content-Type': 'application/json',
            'authorization':Cookies.get('token')
        },
      withCredentials:true,
      
    })

   
    if(response.status===200){
        dispatch({type:GET_CART,payload:response.data})

        var sum=0;
 
   
        getState().productReducer.cartItems.map(item=>{
            sum = sum+(item.product.product_price * item.quantity)
        })
    
   
   
    dispatch({type:TOTAL_AMOUNT,payload:sum})

    }else{

    }

 }

 export const remove_cart_item = (id) => async  (dispatch,getState) => {
     var data = {
         product_id:id
     }
  
    var response = await connect.post('/remove-cart-item',data, {
        
        headers: {
            'Content-Type': 'application/json',
            'authorization':Cookies.get('token')
        },
      withCredentials:true,
      
    })

    if(response.status===200){
      
        dispatch({type:REMOVE_CART_ITEM,payload:id})
        var sum=0;
 
   
        getState().productReducer.cartItems.map(item=>{
            sum = sum+(item.product.product_price * item.quantity)
        })
    
   
   
    dispatch({type:TOTAL_AMOUNT,payload:sum})



    }else{

    }


 }

 export const checkout = (items,total_amount) => async (dispatch) => {
    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
}
const res = await loadScript(
    "https://checkout.razorpay.com/v1/checkout.js"
);

if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
}

// creating a new order
var payload = {
    "cartItems":items,
    "order_amount":total_amount
}


var buyresponse = await connect.post('/buy',payload, {
    
    headers: {
        'Content-Type': 'application/json',
        'authorization':Cookies.get('token')
    },
  withCredentials:true,
  
})




if (!buyresponse) {
    alert("Server error. Are you online?");
    return;
}
console.log('====>****',buyresponse.data.order_result)

dispatch({type:ORDER_PLACED,payload:buyresponse.data})



const options = {
    key: 'rzp_test_EGWzUu3mNjLuP7',
    currency: buyresponse.data.currency,
    amount: buyresponse.data.amount.toString(),
    order_id: buyresponse.data.id,
    handler: async function (response) {
        console.log(response)
        const data = {
            orderCreationId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            order_id:buyresponse.data.order_result.order_id,
            cartItems:buyresponse.data.order_result.cartItems
        };
        var response = await connect.post('/verify-order',data, {
    
            headers: {
                'Content-Type': 'application/json',
                'authorization':Cookies.get('token')
            },
          withCredentials:true,
          
        })
        if(response.data.success){
            history.push('/order-placed')
        }
        console.log(response.data)
    }
}

const paymentObject = new window.Razorpay(options);
paymentObject.open();



 



 }

 export const fetch_orders = () => async (dispatch) => {
    dispatch({type:SHOW_LOADER})
    var response = await connect.get('/fetch-orders', {
        
        headers: {
            'Content-Type': 'application/json',
            'authorization':Cookies.get('token')
        },
      withCredentials:true,
      
    })
    if(!response) return
    if(response.data.success){
        console.log(response.data)
        dispatch({type:HIDE_LOADER})
        dispatch({type:FETCH_ORDERS,payload:response.data.result})
    }
    else{
        dispatch({type:HIDE_LOADER})
    }
    
 }
 
 export const edit_product = (formValues,id) => async (dispatch) => {
    
    
    const formData = new FormData();
    
    formData.append("product_name",formValues.product_name)
    formData.append("product_quantity",formValues.product_quantity)
    formData.append("product_category_id",formValues.product_category_id.value)
    formData.append("product_price",formValues.product_price)
    formData.append("product_image_path",formValues.product_image_path)
    formData.append("product_id",id)
    

    var response = await connect.post('/edit-product',formData, {
        
        headers: {
            'Content-Type': 'application/json',
            'authorization':Cookies.get('token')
        },
      withCredentials:true,
      
    })
    console.log('*&^%&*&(&*',response)
  
    if(response.data.success){ 
       history.push('/')
    }
    else{
        dispatch({type:ERROR,payload:'Something went wrong'})
    }
}
