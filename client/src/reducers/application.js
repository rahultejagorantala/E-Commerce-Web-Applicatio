import {SHOW_LOADER,HIDE_LOADER} from '../actions/types'


var INITIAL_STATE= {
loading:false
}

export const applicationReducer = (state=INITIAL_STATE,action)=>{
    switch(action.type){

        case SHOW_LOADER:
         return {...state,loading:true}
        
        case HIDE_LOADER:
            return {...state,loading:false}
        default:
            return state


    }
}