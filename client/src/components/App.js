import React from 'react'
import Header from './Header'
import Footer from './Footer'
import {BrowserRouter, Router, Route, Switch} from 'react-router-dom'
import Login from './Login'
import Contact from './Contact'
import { connect } from 'react-redux'
import Home from './Home'
import history from '../history'
import Admin from './Admin/Admin'
import ProductCatForm from './Admin/Product/ProductCatForm'
import Signup from './Signup'
import AllProductCats from './Admin/Product/AllProductCats'
import ProtectRoutes from './Admin/AdminProtectRoutes'
import AddProduct from './Admin/Product/AddProduct'
import Sidebar from './Admin/Sidebar'
import Cart from './Cart'
import EditProduct from './Admin/Product/EditProduct'


class App extends React.Component {
    render() {
        return (
            <div>
                {/* Router component to define the routing behavior */}
                <Router history={history}>
                    <Header /> {/* Header component */}
                    {/* Define routes for different components */}
                    <Route path='/' exact component={Home} /> {/* Home route */}
                    <Route path='/login' exact component={Login} /> {/* Login route */}
                    <Route path='/signup' exact component={Signup} /> {/* Signup route */}
                    <Route path='/contact' exact component={Contact} /> {/* Contact route */}
                    <Route path='/cart' exact component={Cart} /> {/* Cart route */}
                    {/* Protected routes accessible only to users with 'admin' permission */}
                    <ProtectRoutes path='/admin' permissions={['admin']} exact component={Admin} /> {/* Admin route */}
                    <ProtectRoutes path='/admin/add-product-category' permissions={['admin']} exact component={ProductCatForm} /> {/* Product category form route */}
                    <ProtectRoutes path='/admin/product-categories' permissions={['admin']} exact component={AllProductCats} /> {/* All product categories route */}
                    <ProtectRoutes path='/admin/add-product' permissions={['admin']} exact component={AddProduct} /> {/* Add product route */}
                    <ProtectRoutes path='/admin/edit-product/:id' permissions={['admin']} exact component={EditProduct} /> {/* Edit product route */}
                    <Footer /> {/* Footer component */}
                </Router>
            </div>
        )
    }
}

// Mapping state to props to access user_role from Redux store
const mapStateToProps = (state) => {
    console.log('==>', state.auth.user_role)
    return { user_role: state.auth.user_role }
}

// Connecting App component to Redux store
export default connect(mapStateToProps)(App)