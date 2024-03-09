import connect from '../apis/connect'
import {LOGIN, LOGOUT,CHECK_LOGIN,SHOW_LOADER,HIDE_LOADER,SIGNUP,RESET} from './types'
import history from '../history'
import Cookies from 'js-cookie';

export const login_action = formValues => async dispatch => {

   console.log('***',formValues.username)
    var payload = JSON.stringify({
        user_email:formValues.username,
        user_password:formValues.password
    })
    dispatch({type:SHOW_LOADER})

    var response = await connect.post('/user-signin', payload, {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials:true,
        
      })
      console.log(response.data)
      dispatch({type:LOGIN,payload:response.data})
    
    
      console.log('GTTTTTING RESPONSE',response)
      
      if(response!=null || response!='undefined' || response!=''){
        Cookies.set('token',response.data.token)
        dispatch({type:HIDE_LOADER})
        if(response.data.success && response.data.user_role==='admin'){
          
          history.push('/admin')
        }
        else if(response.data.success && response.data.user_role==='customer'){
          history.push('/')
        }
      }
     
  
    };

 export const logout_action = () => async dispatch => {
  dispatch({type:SHOW_LOADER})

      var response = await connect.get('/user-signout', {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials:true,
        
      })
      if(response!=null || response!='undefined' || response!=''){
        dispatch({type:HIDE_LOADER})
      }
      window.localStorage.clear()
      dispatch({type:LOGOUT,payload:response.data})
      dispatch({type:RESET})
      history.push('/')
 }   

 export const signup_action = formValues => async dispatch => {

  console.log('***',formValues)
   var payload = JSON.stringify({
       user_email:formValues.user_email,
       user_password:formValues.user_password,
       user_gender:formValues.user_gender.value,
       user_phone:formValues.user_phone,
       street_one:formValues.street_one,
       street_two:formValues.street_two,
       nearby:formValues.nearby,
       city:formValues.city,
       state:formValues.state,
       pin_code:formValues.pin_code,


   })

   dispatch({type:SHOW_LOADER})

   var response = await connect.post('/user-signup', payload, {
       headers: {
           'Content-Type': 'application/json',
       },
       withCredentials:true,
       
     })
     console.log(response.data)
     dispatch({type:SIGNUP,payload:response.data})
   
   
     console.log('GETING RESPONSE',response)
     
     if(response!=null || response!='undefined' || response!=''){
       dispatch({type:HIDE_LOADER})
       if(response.data.success==='true'){
        
         console.log('DONE')
       }
     }
    
 
   };




 export const reset_action = formValues => async dispatch => {
  dispatch({type:RESET})
 }