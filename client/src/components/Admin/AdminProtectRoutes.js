import React from "react";
import { Redirect, Route } from "react-router-dom";
import {connect} from 'react-redux'
import Cookies from 'js-cookie'
var isAuthenticated = false

function ProtectRoutes({ component: Component, ...restOfProps }) {
 

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

const mapStateToProps = (state,ownProps)=>{
   
   isAuthenticated = state.auth.isSignedIn && ownProps.permissions.includes(state.auth.user_role) && Cookies.get('token')!=null
    return { isSignedIn: state.auth.isSignedIn, user_role:state.auth.user_role}
}

export default connect(mapStateToProps)(ProtectRoutes)
