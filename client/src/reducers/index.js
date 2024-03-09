import {combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form'
import {authReducer} from './auth'
import productReducer from './product'
import {applicationReducer} from './application'

export default combineReducers({
    form:formReducer,
    auth:authReducer,
    productReducer:productReducer,
    loading:applicationReducer
})