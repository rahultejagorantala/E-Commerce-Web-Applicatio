import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProductForm from './ProductForm'
import {fetch_product_by_id,edit_product} from '../../../actions/products'

class EditProduct extends Component {

 
    onSubmit=(data)=>{
        this.props.edit_product(data,this.props.match.params.id)
      }
      
      renderErrorMesg=(props)=>{
          console.log('ERRRORRRRRR',props)
       if(props.length===0) return null
        return(
            <div>
                <h4>{props.props}</h4>
            </div>
        )
      }

    render() {
        return (
            <div>
                {/* <this.renderErrorMesg props={this.props.error}/> */}
               <ProductForm onSubmit={this.onSubmit} initialValues={this.props.product.data}/>
            </div>
        )
    }
}

const mapStateToProps = (state)=>{
    console.log('==>SINGLEEEEEEE PRODUCTTTTT',state.productReducer.error)
    return { isSignedIn: state.auth.isSignedIn,
        product: state.productReducer.product,
        error:state.productReducer.status
    }
}

export  default connect(mapStateToProps,{fetch_product_by_id,edit_product})(EditProduct)
