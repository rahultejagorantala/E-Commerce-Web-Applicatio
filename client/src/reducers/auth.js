
import {LOGIN,LOGOUT,CHECK_LOGIN, SIGNUP,RESET} from '../actions/types'
import history from '../history'

const INITIAL_STATE = {
    isSignedIn:false,
    errors:[],
    success:false,
    user_role:'customer'
}

export const authReducer = (state=INITIAL_STATE,action)=>{
    var data  = action.payload
    switch(action.type)
    {
        case LOGIN:
            if(data.success){
            
               return {...state,isSignedIn:true,success:true,user_role:data.user_role}
            }
           else{
            return  {...state,isSignedIn:false,errors:[data.status],success:data.success}
           }
        
        case LOGOUT:
           
            if(action.payload.Message==='Signout'){
                   
                return {...state,isSignedIn:false}
            }   
            else{
                return  {...state,isSignedIn:false,errors:[data.status],success:data.success}
               }

        case SIGNUP:
            return  {...state,isSignedIn:false,errors:[data.status],success:data.success}

        case RESET:
            return  {...state,errors:[],success:false, user_role:''}
        default:
            return state
    }

}