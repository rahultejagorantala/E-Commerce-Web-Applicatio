import React, { Component } from 'react';
import ProductForm from './ProductForm'; 
import Sidebar from '../Sidebar'; 
import { connect } from 'react-redux'; 
import { post_product } from '../../../actions/products'; 

class AddProduct extends Component {
    // Function to handle form submission
    onSubmit = (data) => {
        this.props.post_product(data); // Dispatching the post_product action with the form data
    }

    render() {
        return (
            <div>
                <Sidebar compnt={<ProductForm onSubmit={this.onSubmit} />} />
            </div>
        );
    }
}

// Connecting the component to the Redux store and mapping the post_product action creator to props
export default connect(null, { post_product })(AddProduct);
