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


class App extends React.Component{
    render(){
        return (
             <div>
                
                   <Router history={history}>
                   
                   <Header/>
                   <Route path='/' exact  component={Home} />
                   <Route path='/login' exact component={Login} />
                   <Route path='/signup' exact component={Signup} />
                   <Route path='/contact' exact component={Contact} />
                   <Route path='/cart' exact component={Cart} />
                   
              
                
                   <ProtectRoutes path='/admin' permissions={['admin']} exact component={Admin} />
                  
                   <ProtectRoutes path='/admin/add-product-category' permissions={['admin']} exact component={ProductCatForm} />
                   
                   <ProtectRoutes path='/admin/product-categories' permissions={['admin']} exact component={AllProductCats} />
                   
                   <ProtectRoutes path='/admin/add-product' permissions={['admin']} exact component={AddProduct} />

                   <ProtectRoutes path='/admin/edit-product/:id' permissions={['admin']} exact component={EditProduct} /> 
                   <Footer/>
                  
                   </Router>
                   
             
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    console.log('==>', state.auth.user_role)
    return { user_role:state.auth.user_role }
}


export default connect(mapStateToProps)(App)