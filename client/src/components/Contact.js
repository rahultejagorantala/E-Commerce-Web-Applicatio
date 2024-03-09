import React from 'react'
import {connect} from 'react-redux' 
import {login_action} from '../actions'


class Contact extends React.Component {
    render(){
        return(
            <div>
                <h1>{this.props.isSignedIn?'TTUE':'NOT'}</h1>
            </div>
        )
    }
}

const mapStateToProps = (state)=>{
   
    return { isSignedIn: state.auth.isSignedIn}
}

export default connect(mapStateToProps,{login_action})(Contact)