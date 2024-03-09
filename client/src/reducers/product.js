
import {FETCH_PRODUCT_CATS, 
    POST_PRODUCT_CAT,POST_PRODUCT,
    FETCH_PRODUCTS, 
    DELETE_PRODUCT,ADD_TO_CART,RESET, GET_CART,
     REMOVE_CART_ITEM, TOTAL_AMOUNT,FETCH_PRODUCT_BY_ID, ERROR, FETCH_ORDERS} from '../actions/types'
import _ from 'lodash'


const INITIAL_STATE = {
    productCats:[],
    status:[],
    success:false,
    products:[],
    cart:[],
    cartItems:[],
    Total_amount:0,
    product:[],
    orders:[]

}

export default  (state=INITIAL_STATE,action)=>{

    switch(action.type)
    {
        case POST_PRODUCT_CAT:
           
            return state

        case FETCH_PRODUCT_CATS:
            
            return {...state,productCats:action.payload}

        case POST_PRODUCT:
            return {...state, status:[action.payload.status],success:action.payload.success}

        case FETCH_PRODUCTS:
            return {...state,products:action.payload}

        case DELETE_PRODUCT:
            const deleteFromArray = state.products.filter((item) => item.product_id !== action.payload);
            return {...state,products:deleteFromArray}

        case ADD_TO_CART:
              
             return {...state,cart:[...state.cart,action.payload]}

        case GET_CART:
            console.log("GETTT CARTTT",action.payload)
            
            return {...state,cartItems:action.payload,cart:action.payload.map(v=>v.product.product_id)}

        case RESET:
                return  {...state,status:[],cart:[],cartItems:[],Total_amount:0,product:[]}     

        case REMOVE_CART_ITEM:
          
      
        const deleteCartItem = state.cartItems.filter((pro) => pro.productProductId !== parseInt(action.payload))
          
            const filteredItems = state.cart.filter(item => item !== parseInt(action.payload))
         
            return {...state,cartItems:deleteCartItem,cart:filteredItems}

        case TOTAL_AMOUNT:
            return {...state,Total_amount:action.payload}

        case FETCH_PRODUCT_BY_ID:
            return {...state,product:action.payload}   
         
        case ERROR:
            return {...state,status:action.payload}    

        case FETCH_ORDERS:
             return {...state,orders:action.payload}   

        default:
            return state   
    }
}