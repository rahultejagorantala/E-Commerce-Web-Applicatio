import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { signup_action,reset_action } from '../actions'
import _ from 'lodash'
import { useHistory, Redirect } from "react-router-dom";
import history from '../history'
import FulPageLoader from './FulPageLoader'
import Select from 'react-select'

class Signup extends React.Component {


    componentDidMount(){
        if(this.props.isSignedIn){
            history.push('/')
        }
    }

    renderErrors(props) {
        console.log('%%%%', props.props.errors)
        if (props.props.errors.length === 0 || props.props.success) return null
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
    renderInput = ({ input, label, type, meta, className,divClass }) =>{
        return (
            <div className={divClass}>

                <label>{label}</label>
                <input type={type} className={className} {...input} autoComplete='off' />
                {this.renderFormInputErrors(meta)}
            </div>

        )
    }
    renderSuccessMessage = (props)=>{
       
        if(this.props.success){
          
            return(
                <div>
                     <div className="alert alert-success" role="alert">
                    Signup successful, Click on login button and enter login details
                </div>
                </div>
            )
        }
        return null
       
    }



    onSubmitForm = (formProps) => {
       
       this.props.signup_action(formProps)
       
       
    }
    userOptions = [
        { value: 'Female', label: 'Female' },
        { value: 'Male', label: 'Male' },

    ]

    ReduxFormSelect = props => {
        const { input, options,meta, className,divClass,label } = props;
        console.log('INPUTTTTTT',input)
        return (
            <>
                <label>{label}</label>
                <Select 
                {...input}
                onChange={value => input.onChange(value)}
                onBlur={() => input.onBlur(input.value)}
                options={options}
                className={className}
            />
              {this.renderFormInputErrors(meta)}
            </>
        )
    }

    render() {
        console.log(this.props)
        return (
            <div>
                <div >
                    <this.renderErrors props={this.props} />
                    <this.renderSuccessMessage props={this.props} />
                   
                    <form onSubmit={this.props.handleSubmit(this.onSubmitForm)} >

                    <div class="signupForm">
                        <Field type='email' className="form-control" name="user_email" component={this.renderInput} label="Enter Username" />
                        <Field type='password'  className="form-control" name="user_password" component={this.renderInput} label="Enter Password" />
                        <Field name="user_gender"  className="" component={this.ReduxFormSelect} options={this.userOptions} label="Gender" />
                        <Field type='tel'  divClass="" className="form-control" name="user_phone" component={this.renderInput} label="Enter Mobile No." />
                        <Field type='text'  className="form-control" name="street_one" component={this.renderInput} label="Street One" />
                        <Field type='text' className="form-control" name="street_two" component={this.renderInput} label="Street two" />
                        <Field name="text" name="nearby" className="form-control" component={this.renderInput} label="Landmark" />
                        <div className='form-row'>
                        <Field name="text" divClass="form-group col-md-6" name="city" className="form-control" component={this.renderInput} label="City" />
                        <Field name="text" divClass="form-group col-md-4" name="state" className="form-control" component={this.renderInput} label="State" />
                        <Field name="text" divClass="form-group col-md-2" name="pin_code" className="form-control" component={this.renderInput} label="PIN" />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                   </div>
                    </form>
                </div>
                <FulPageLoader />
            </div>

        )


    }



}
const validate = (formInputs) => {
    const errors = {}
    if (!formInputs.user_email) {
        errors.user_email = "Enter your username"
    }
    if (!formInputs.user_password) {
       
        errors.user_password = "Enter your password"
    }
     if(formInputs.user_password){
        if(formInputs.user_password.length<8){
            errors.user_password = "Password length must be atleast 8 "  
        }
       
    }
     if (!formInputs.user_gender) {
        errors.user_gender = "Select Gender"
    }
     if (!formInputs.user_phone) {
        errors.user_phone = "Enter your mobile no."
       
    }
     if (!formInputs.street_one) {
        errors.street_one = "Enter address"
    }
     if (!formInputs.city) {
        errors.city = "Enter city name"
    }
     if (!formInputs.state) {
        errors.state = "Enter state name"
    }
     if (!formInputs.pin_code) {
        errors.pin_code = "Enter pin code"
    }

    return errors
}

const formaWrapped = reduxForm({
    form: 'Signup',
    validate: validate
})(Signup)


const mapStateToProps = (state) => {
    console.log('==>', state.auth)
    return { isSignedIn: state.auth.isSignedIn, errors: state.auth.errors,success:state.auth.success }
}


export default connect(mapStateToProps, { signup_action,reset_action })(formaWrapped)