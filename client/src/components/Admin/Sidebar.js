import React, { Component } from 'react'
import { Link } from 'react-router-dom'


export default class Sidebar extends Component {
    render() {
        return (

            <div className="wrapper">

                <nav id="sidebar">

                    <div className="sidebar-header ">
                        <h3>Admin Dashboard</h3>
                    </div>

                    <ul className="list-unstyled components">

                        <li className="active">
                            <a href="#homeSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Product Categories</a>
                            <ul className="collapse list-unstyled" id="homeSubmenu">
                                <li>
                                    <Link to="/admin/add-product-category">All</Link>
                                </li>
                                <li>
                                    <Link to="/admin/add-product-category">New</Link>
                                </li>

                            </ul>
                        </li>
                        <li >
                        <a href="#pageSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Products</a>
                        <ul className="collapse list-unstyled" id="pageSubmenu">
                        <li  className="">
                        <Link to="/admin/add-product-category">All Products</Link>
                                </li>
                                <li>
                            <Link to="/admin/add-product">New Product</Link>
                                </li>
                               

                        </ul>
                        </li>
                     
                     
                    </ul>

                   
                </nav>

                <div id="content">

                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="container-fluid">

                            <button type="button" id="sidebarCollapse" className="btn btn-info">
                                <i className="fas fa-bars fa-1x"></i>
                                <span>Toggle Sidebar</span>
                            </button>
                            <button className="btn btn-dark d-inline-block d-lg-none ml-auto" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <i className="fas fa-bars fa-1x"></i>
                            </button>

                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <h5 className='ml-auto'>Hi, Admin</h5>
                            </div>
                        </div>
                    </nav>

                    {this.props.compnt}
                </div>

            </div>

        )
    }
}
