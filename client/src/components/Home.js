import React from 'react'
import { connect } from 'react-redux'
import { fetch_all_products, get_cart } from '../actions/products'
import { BASE_URL } from '../apis/config'
import ProductCard from './ProductCard'
import history from '../history'
import FulPageLoader from './FulPageLoader'

class Home extends React.Component {

    componentDidMount() {
        this.props.fetch_all_products()
        this.props.get_cart()
    }

    // Function to render the products fetched from the Redux store.
    renderProducts(mprops) {
        return (
            <div className="container" id="product_container">
                <div className="row text-center">
                    {  
                        // Map over the array of products and render a ProductCard component for each product.
                        mprops.mprops.AllProducts.map((p, i) => {
                            return (
                                <div className="border col-3 mb-4" key={p.product_id}>
                                    <ProductCard
                                        Parrayid={i}
                                        Pid={p.product_id}
                                        Pimg={BASE_URL + p.product_image_path}
                                        Pname={p.product_name}
                                        Pprice={p.product_price}
                                        Pcatname={p.category.cat_name}
                                    />
                                </div>
                            )
                        })
                    }
                </div>
                {/* Display a Full Page Loader while products are being fetched */}
                <FulPageLoader/>
            </div>
        )
    }

    // Render method to render the component.
    render() {
        return (
            <div>
                {/* Render the products using the renderProducts method */}
                <this.renderProducts mprops={this.props} />
            </div>
        )
    }
}

// mapStateToProps function to map state from Redux store to component props.
const mapStateToProps = (state) => {
    return { AllProducts: state.productReducer.products }
}

// Connect the component to Redux store and export it.
export default connect(mapStateToProps, { fetch_all_products, get_cart })(Home)
