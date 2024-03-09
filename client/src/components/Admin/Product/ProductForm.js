import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import FulPageLoader from '../../FulPageLoader'
import Select from 'react-select'
import {fetch_product_cats,post_product} from '../../../actions/products'
import FileInput from '../../FileInput'



class ProductForm extends Component {

    catOptions = [
       
    ]
    componentDidMount(){
        this.props.fetch_product_cats()
       
        
        this.props.productCats.map(val=>{
           
            this.catOptions.push(  { value: val.cat_id, label: val.cat_name },)
        })
        
    }
    
    renderErrors(props) {
        console.log('%%%%', props.props.errors)
        // if (props.props.errors.length === 0 || props.props.success) return null
        // return (

        //     <div className="alert alert-danger" role="alert">
        //         {props.props.errors}
        //     </div>
        // )
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
                   Product Added
                </div>
                </div>
            )
        }
        return null
       
    }



    onSubmitForm = (formProps) => {
       
       //this.props.post_product(formProps)
       this.props.onSubmit(formProps)
       
    }
    userOptions = [
       
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
        return (
            <div>
            <div >
               
                <this.renderSuccessMessage props={this.props.productReducer} />
               
                <form onSubmit={this.props.handleSubmit(this.onSubmitForm)} >

                <div className="productForm">
                    <Field type='text' className="form-control" name="product_name" component={this.renderInput} label="Enter Product Name" />
                    <Field type='number'  className="form-control" name="product_quantity" component={this.renderInput} label="Total Stock" />
                    <Field name="product_category_id"  className="" component={this.ReduxFormSelect} options={this.catOptions} label="Category" />
                    <Field type='number'  divClass="" className="form-control" name="product_price" component={this.renderInput} label="Price" />
                    <Field type='file'  className="form-control" name="product_image_path" component={FileInput} label="Image" />
                </div>
               <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
            <FulPageLoader />
        </div>
        )
    }
}
const mapStateToProps = (state)=>{
    console.log('==>STATS',state.productReducer)
    return { isSignedIn: state.auth.isSignedIn,
        productCats:state.productReducer.productCats,
        productReducer: state.productReducer
    }
} 



const validate = (formInputs) => {
    const errors = {}
    if (!formInputs.product_name) {
        errors.product_name = "Enter the name of product"
    }
    if (!formInputs.product_quantity) {
       
        errors.product_quantity = "Enter total stock"
    }
     if(!formInputs.product_category_id){
        errors.product_category_id = "Select Category"
       
    }
     if (!formInputs.product_price) {
        errors.product_price = "Enter price"
    }
   

    return errors
}


const formaWrapped = reduxForm({
    form: 'ProductForm',
    validate:validate
})(ProductForm)





export default connect(mapStateToProps, { fetch_product_cats,post_product })(formaWrapped)
