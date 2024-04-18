import React, { Component } from 'react'
import { get_cart, remove_cart_item, checkout } from '../actions/products'
import { connect } from 'react-redux'
import history from '../history'
import { BASE_URL } from '../apis/config'

// Define the Cart component
class Cart extends Component {

    city = ''
    pin_code = ''

    constructor(props) {
        super(props);
        this.state = { cart_total: 0 }
    }

    // Lifecycle method - called after the component is mounted
    componentDidMount() {
        if (!this.props.isSignedIn) {
            history.push('/login')
        }
        this.props.get_cart()
    }

    // Handler for removing an item from the cart
    onRemoveItemClick = (id) => {
        this.props.remove_cart_item(id.target.getAttribute('id'))
    }

    // Handler for checkout button click
    checkout = () => {
        this.props.checkout(this.props.cartItems, this.props.total)
    }

    // Render method - generates the JSX to be rendered
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className='col-8'>
                        {/* Render each item in the cart */}
                        {this.props.cartItems.map(p => {
                            // Extract city and pin code from user address JSON
                            if (p.user.user_address) {
                                try {
                                    this.pin_code = JSON.parse(p.user.user_address).pin_code
                                    this.city = JSON.parse(p.user.user_address).city
                                } catch (error) {
                                    console.log(error)
                                }
                            }
                            // Render individual cart item
                            return <div className="card w-80" key={p.cart_id}>
                                <div className="row">
                                    <div className='col-6'>
                                        <div className="card-body">
                                            <h5 className="card-title">{p.product.product_name}</h5>
                                            <p className="card-text">{'Will be delivered at ' + this.city + ',' + this.pin_code}</p>
                                            <button id={p.productProductId} onClick={this.onRemoveItemClick} className="btn  btn-danger " >Remove</button>
                                        </div>
                                    </div>
                                    <div className='col-6'>
                                        <div className="card-body">
                                            <div className=' text-right'>
                                                <img id="cart_product_img" className=" text-right img-fluid w-100" src={BASE_URL + p.product.product_image_path} alt="shoplyk" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                    <div className='col-4 mt-10'>
                        {/* Cart summary */}
                        <div className='card '>
                            <div className="card-body">
                                <h5 className="card-title">Total</h5>
                                <hr/>
                                {/* Render sub-total, shipping, and address */}
                                <div className="row">
                                    <div className="col-6">
                                        <h6>Sub-total</h6>
                                        <h6>Shipping</h6>
                                        <h6>Address</h6>
                                    </div>
                                    <div className="col-6">
                                        <h6>Rs.{this.props.total}</h6>
                                        <h6>FREE</h6>
                                        <h6>{this.city}</h6>
                                    </div>
                                </div>
                                <hr/>
                                {/* Checkout button */}
                                <button onClick={this.checkout} type="button" id='button_color' className="btn w-100">Checkout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

// Map state to props
const mapStateToProps = (state) => {
    return { 
        isSignedIn: state.auth.isSignedIn, 
        cartItems: state.productReducer.cartItems,
        total: state.productReducer.Total_amount
    }
}

// Connect Cart component to Redux store
export default connect(mapStateToProps, { get_cart, remove_cart_item, checkout })(Cart)
