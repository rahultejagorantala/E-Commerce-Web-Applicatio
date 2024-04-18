
import React from "react";
import { Redirect, Route } from "react-router-dom";
import { connect } from 'react-redux'; 
// Define a variable to track whether the user is authenticated
var isAuthenticated = false;

// Component definition for protecting routes based on authentication status
function ProtectRoutes({ component: Component, ...restOfProps }) {
  return (
    <Route
      {...restOfProps}
      render={(props) =>
        // If user is authenticated, render the requested component
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

// mapStateToProps function to map Redux state to component props
const mapStateToProps = (state, ownProps) => {
  isAuthenticated = state.auth.isSignedIn && ownProps.permissions.includes(state.auth.user_role) && Cookies.get('token') != null;
  
  // Return relevant state props
  return { isSignedIn: state.auth.isSignedIn, user_role: state.auth.user_role };
}

// Connect the ProtectRoutes component to the Redux store
export default connect(mapStateToProps)(ProtectRoutes);
