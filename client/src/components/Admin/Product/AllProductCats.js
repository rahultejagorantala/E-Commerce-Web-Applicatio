import React, { Component } from 'react';
import connect from '../../../apis/connect';
import Cookies from 'js-cookie';

export default class AllProductCats extends Component {
    componentDidMount() {
        this.fetching();
    }

    // Async function to fetch data from the server
    fetching = async () => {
        try {
            // Making an API call to fetch all product categories
            const response = await connect.get('/all-cats', {
                headers: {
                    'authorization': Cookies.get('token'), // Send the token stored in cookies as authorization
                    'Content-Type': 'application/json', // Specify content type as JSON
                },
                withCredentials: true, // Ensure that credentials are sent with the request
            });

            console.log('************', response);
        } catch (error) {
            console.error('Error fetching product categories:', error);
        }
    };

    render() {
        return (
            <div>
                {/* Display a heading */}
                <h1>All Products</h1>
            </div>
        );
    }
}
