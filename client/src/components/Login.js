import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {connect} from 'react-redux'
import {login_action,reset_action} from '../actions'
import _ from 'lodash'
import { useHistory, Redirect } from "react-router-dom";
import history from '../history'
import FulPageLoader from './FulPageLoader'
import Select from 'react-select'

class Login extends React.Component {
    // This method is called when the component is mounted
    componentDidMount(){
        this.props.reset_action() 
    }

    // Render any errors that occur during form submission
    renderErrors(props){
        console.log('%%%%',props.props.errors)
        if(props.props.errors.length===0) return null
        return (
            <div className="alert alert-danger" role="alert">
                {props.props.errors}
            </div>
        )
    }

    // Render individual input errors if the input has been touched and there's an error
    renderFormInputErrors = ({error, touched})=>{
        if(error && touched){
            return <div className="alert alert-danger" role="alert">{error}</div>
        }
    }

    // Render input fields
    renderInput=({ input, label, type, meta }) =>{
        return (
            <div>
                <label>{label}</label>
                <input type={type} className="form-control" {...input} autoComplete='off' />
                {this.renderFormInputErrors(meta)} {/* Render input errors if any */}
            </div>
        )
    }

    // Handle form submission
    onSubmitForm=(formProps)=>{
        this.props.login_action(formProps) // Dispatches an action to perform login
    }

    render() {
        console.log(this.props)
        return (
            <div>
                <div className="container-fluid h-100 login_form">
                    <div className="row justify-content-center align-items-center h-100">
                        <div className="col col-sm-6 col-md-6 col-lg-4 col-xl-3">
                            <this.renderErrors props={this.props} /> {/* Render any errors */}
                            <form onSubmit={this.props.handleSubmit(this.onSubmitForm)} >
                                <div className="form-group">
                                    <Field type='email' name="username" component={this.renderInput} label="Enter Username" />
                                    <Field type='password' name="password" component={this.renderInput} label="Enter Password" />
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
                <FulPageLoader/> {/* Display a full-page loader */}
            </div>
        )
    }
}

// Validation function for form inputs
const validate = (formInputs)=>{
    const errors = {}
    if(!formInputs.username){
        errors.username = "Enter your username"
    } else if(!formInputs.password){
        errors.password = "Enter your password"
    }
    return errors
}
 
// Wrap the Login component with reduxForm HOC
const formaWrapped = reduxForm({
    form: 'login',
    validate: validate
})(Login)

// Map Redux state to component props
const mapStateToProps = (state)=>{
    console.log('==>',state.auth.errors)
    return { isSignedIn: state.auth.isSignedIn , errors: state.auth.errors}
}

// Connect component to Redux store and export it
export default connect(mapStateToProps, {login_action, reset_action})(formaWrapped)
