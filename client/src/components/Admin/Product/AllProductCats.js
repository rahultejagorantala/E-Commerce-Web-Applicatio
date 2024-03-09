import React, { Component } from 'react'
import connect from '../../../apis/connect'
import Cookies from 'js-cookie'
export default class AllProductCats extends Component {


    componentDidMount(){
      this.fetching()
    }
    fetching= async()=> {
        var response = await connect.get('/all-cats', {
            headers: {
                'authorization':Cookies.get('token'),
                'Content-Type': 'application/json',
            },
            withCredentials:true,
            
          })
          console.log('************',response)
    }

    render() {
        return (
            <div>
                <h1>All Products</h1>
            </div>
        )
    }
}
