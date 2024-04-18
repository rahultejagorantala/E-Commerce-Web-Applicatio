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

    // Function to render products
    renderProducts(mprops) {
        return (
            <div className="container" id="product_container">
                <div className="row text-center">
                    {
                        // Mapping through all products and rendering ProductCard component for each
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
                <FulPageLoader /> {/* Render FullPageLoader component */}
            </div>
        )
    }

    render() {
        return (
            <div>
                <this.renderProducts mprops={this.props} /> {/* Render products */}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    // Mapping state to props, getting all products from productReducer
    console.log('HOMEEEEE', state.productReducer)
    return { AllProducts: state.productReducer.products }
}

// Connecting component to Redux store, mapping dispatch to props
export default connect(mapStateToProps, { fetch_all_products, get_cart })(Home)
