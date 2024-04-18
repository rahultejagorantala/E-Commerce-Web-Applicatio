import React from 'react';
import { connect } from 'react-redux';
import { login_action } from '../actions'; 

// Contact component
class Contact extends React.Component {
    render(){
        return(
            <div>
                {/* Displaying whether the user is signed in or not based on the isSignedIn prop */}
                <h1>{this.props.isSignedIn ? 'TTUE' : 'NOT'}</h1>
            </div>
        )
    }
}

// mapStateToProps function to map state to props
const mapStateToProps = (state) => {
    return { isSignedIn: state.auth.isSignedIn };
}

// Connecting the Contact component to Redux store and passing mapStateToProps and login_action as props
export default connect(mapStateToProps, { login_action })(Contact);
