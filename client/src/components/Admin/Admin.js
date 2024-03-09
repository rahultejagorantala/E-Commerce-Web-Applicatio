import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Sidebar from './Sidebar'
import {BrowserRouter, Router, Route, Switch} from 'react-router-dom'
import FulPageLoader from '../FulPageLoader'
import history from '../../history'

class Admin extends Component {
    render() {
        return (
            <div>
            
                {/* <Link  to="/add-product-category">Add Product Category</Link> */}
                
               <Sidebar/>

                <FulPageLoader/>
               
            </div>
        )
    }
}

export default Admin