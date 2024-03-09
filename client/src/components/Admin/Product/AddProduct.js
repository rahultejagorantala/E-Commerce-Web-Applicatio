import React, { Component } from 'react'
import ProductForm from './ProductForm'
import Sidebar from '../Sidebar'
import { connect } from 'react-redux'
import {post_product} from '../../../actions/products'


 class AddProduct extends Component {


    onSubmit=(data)=>{
      this.props.post_product(data)
    }

    render() {
        return (
            <div>
                <Sidebar compnt={<ProductForm  onSubmit={this.onSubmit} />}/>

            </div>
        )
    }
}





export default connect(null, { post_product })(AddProduct)
