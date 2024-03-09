import React, { Component } from 'react'
import { connect } from 'react-redux'
import {delete_product,add_to_cart,fetch_product_by_id} from '../actions/products'
import { FaShoppingCart } from "react-icons/fa";
import history from '../history'
import FulPageLoader from './FulPageLoader'

class ProductCard extends Component {




    onDeleteClick=()=>{
       
        this.props.delete_product(this.props.Pid)
    }

    addToCartBtn=()=>{
        if(this.props.isSignedIn){
            this.props.add_to_cart(this.props.Pid)
           
            
        }
        else{
            history.push('/login')
        }
        
    }

    onEditClick=(id)=>{
    
      //  history.push(`/admin/edit-product/${id.target.getAttribute('id')}`)
        this.props.fetch_product_by_id(id.target.getAttribute('id'))
    }

    renderEditDeleteBtn(id){
        if(this.props.userRole==='admin'){
            return(
                <div >
                   <button id={id} onClick={this.onEditClick}  type="button" className="btn btn-warning btn-sm mr-1 mb-2">
                            Edit
                   </button>
                    <button onClick={this.onDeleteClick} type="button" className="btn btn-danger btn-sm mr-1 mb-2">
                           Delete
                    </button>
                </div>
            )
        }
    }




    render() {
       
        return (
            

                <div className="view zoom overlay" id="p_card">


                    <img id="product_img" className="img-fluid w-100" src={this.props.Pimg} alt="shoplyk" />

                    <h4 className="mb-0"><span className="badge badge-primary badge-pill badge-news">Sale</span></h4>
                    <div className="card-body text-center">

                        <h5>{this.props.Pname}</h5>
                        <p className="small text-muted text-uppercase mb-2">{this.props.Pcatname}</p>
                      

                        <h6 className="mb-3">
                            <span className="text-danger mr-1">{'Rs. '+this.props.Pprice}</span>
                            
                        </h6>

                        <button 
                        disabled={this.props.cart.includes(this.props.Pid)}
                        onClick={this.addToCartBtn} type="button" className="btn btn-primary btn-sm mr-1 mb-2">
                            <i className="fas fa-shopping-cart pr-2"></i>Add to cart
                        </button>
                       
                        
                        {this.renderEditDeleteBtn(this.props.Pid)}
                    </div>
                    <FulPageLoader/>
                </div>


        )
    }
}

const mapStateToProps = (state) => {
    console.log('==>', state.productReducer)
    return { isSignedIn: state.auth.isSignedIn,userRole:state.auth.user_role, cart:state.productReducer.cart }
}

export default  connect(mapStateToProps,{delete_product,add_to_cart,fetch_product_by_id})(ProductCard)