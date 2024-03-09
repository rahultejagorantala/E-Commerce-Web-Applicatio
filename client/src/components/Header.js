import React, { Component } from 'react'
import { connect } from 'react-redux'
import { login_action, logout_action } from '../actions'
import { Link } from 'react-router-dom'
import history from '../history'
import { FaShoppingCart, FaBars } from "react-icons/fa";

class Header extends Component {

    currentTab = (history, path) => {
        if (history.location.pathname === path) {
            return { color: 'E31339' }
        }
        else {
            return { color: 'ADACAD' }
        }
    }
    renderAuthButton = () => {
        if (this.props.isSignedIn && this.props.isSignedIn != null) {
            return (
                <div>
                    <li className="nav-item ">
                        <Link className="nav-link" onClick={this.props.logout_action} to="/logout">Logout</Link>
                    </li>
                </div>
            )
        }
        else {
            return (
                <>

                    <li className="nav-item ">
                        <Link style={this.currentTab(history, '/login')} data-toggle="collapse" className="nav-link" to="/login">Login</Link>
                    </li>
                    <li className="nav-item ">
                        <Link style={this.currentTab(history, '/signup')} data-toggle="collapse" className="nav-link" to="/signup">Signup</Link>
                    </li>

                </>
            )
        }

    }

    render() {
        return (
            <div className="header" >
                <nav className="navbar sticky-top navbar-expand-lg " id="header">

                    <Link style={this.currentTab(history, '/')} className="navbar-brand" to="/">

                        {/* <img src="./logo192.png" width="30" height="30" className="d-inline-block align-top" alt="" /> */}
                        <h4 id="icon_text">ShopyLyk.com</h4>

                    </Link>

                    <button className="navbar-toggler" id="ham" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">

                        <FaBars color="#ffffff" />
                    </button>


                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav navbar-nav px-5 ml-auto">
                            <li className="nav-item px-2 ">
                                <Link style={this.currentTab(history, '/')} className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
                            </li>
                            <li className="nav-item px-2">
                                <Link style={this.currentTab(history, '/')} className="nav-link" to="#">Products</Link>
                            </li>
                            <li className="nav-item px-2">
                                <Link style={this.currentTab(history, '/about')} className="nav-link" to="#">About</Link>
                            </li>
                            <li className="nav-item px-2">
                                <Link style={this.currentTab(history, '/contact')} className="nav-link" to="#">Contact</Link>
                            </li>
                            <li className="nav-item px-2">
                                <Link style={this.currentTab(history, '/admin')} className="nav-link" to="/admin">Admin</Link>
                            </li>
                            {this.renderAuthButton()}

                             <Link style={this.currentTab(history,'/cart')} id="cart_icon" className="px-4 nav-link" to="/cart">
                        Cart
                         <FaShoppingCart className="ml-1" color="#FFFFFF"/>
                          {this.props.cartItems}  
                        </Link>

                            

                        </ul>
                    </div>



                </nav>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    console.log('LOGIN', state.auth)
    return { isSignedIn: state.auth.isSignedIn, cartItems:state.productReducer.cart.length }
}

export default connect(mapStateToProps, { login_action, logout_action })(Header)
