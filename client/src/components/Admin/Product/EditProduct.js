import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProductForm from './ProductForm' 
import { fetch_product_by_id, edit_product } from '../../../actions/products' 

class EditProduct extends Component {

    // Function to handle form submission
    onSubmit = (data) => {
        // Calling the edit_product action creator with the form data and product ID
        this.props.edit_product(data, this.props.match.params.id)
    }

    // Function to render error message
    renderErrorMesg = (props) => {
        console.log('ERRRORRRRRR', props)
        if (props.length === 0) return null
        return (
            <div>
                <h4>{props.props}</h4>
            </div>
        )
    }

    render() {
        return (
            <div>
                <ProductForm onSubmit={this.onSubmit} initialValues={this.props.product.data} />
            </div>
        )
    }
}

// Mapping Redux state to component props
const mapStateToProps = (state) => {
    console.log('==>SINGLEEEEEEE PRODUCTTTTT', state.productReducer.error)
    return {
        isSignedIn: state.auth.isSignedIn,
        product: state.productReducer.product,
        error: state.productReducer.status
    }
}

// Connecting the component to Redux store and exporting it
export default connect(mapStateToProps, { fetch_product_by_id, edit_product })(EditProduct)
