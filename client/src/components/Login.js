import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {connect} from 'react-redux'
import {login_action,reset_action} from '../actions'
import _ from 'lodash'
import { useHistory,Redirect } from "react-router-dom";
import history from '../history'
import FulPageLoader from './FulPageLoader'
import Select from 'react-select'
 

class Login extends React.Component {


    componentDidMount(){
        this.props.reset_action()
    }
   
    renderErrors(props){
     console.log('%%%%',props.props.errors)
     if(props.props.errors.length===0) return null
       return (
          
           <div className="alert alert-danger" role="alert">
               {props.props.errors}
           </div>
       )
    }

    renderFormInputErrors = ({error,touched})=>{
        if(error && touched){
            return    <div className="alert alert-danger" role="alert">{error}</div>
        }
    }

    renderInput=({ input, label,type, meta }) =>{
        return (
            <div>
                
                <label>{label}</label>
                <input type={type} className="form-control" {...input} autoComplete='off' />
                {this.renderFormInputErrors(meta)}
            </div>

        )
    }

    onSubmitForm=(formProps)=>{
        
        this.props.login_action(formProps)
        
    
    }


    render() {
        console.log(this.props)
        return (
            <div>
            <div className="container-fluid h-100 login_form">
                <div className="row justify-content-center align-items-center h-100">
                    <div className="col col-sm-6 col-md-6 col-lg-4 col-xl-3">
                        <this.renderErrors props={this.props} />
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
            <FulPageLoader/>
            </div>

        )
  
       
    }



}
const validate = (formInputs)=>{
    const errors = {}
    if(!formInputs.username){
        errors.username = "Enter your username"
    }
    else  if(!formInputs.password){
        errors.password = "Enter your password"
    }
    return errors
}
 
  const formaWrapped = reduxForm({
    form: 'login',
    validate:validate
})(Login)


const mapStateToProps = (state)=>{
    console.log('==>',state.auth.errors)
    return { isSignedIn: state.auth.isSignedIn , errors:state.auth.errors}
}


export default connect(mapStateToProps, {login_action,reset_action})(formaWrapped)