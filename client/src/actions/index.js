// Importing necessary dependencies and modules
import connect from '../apis/connect'; // Assuming connect is an API module
import { LOGIN, LOGOUT, CHECK_LOGIN, SHOW_LOADER, HIDE_LOADER, SIGNUP, RESET } from './types'; // Importing action types
import history from '../history'; // Importing history object for navigation
import Cookies from 'js-cookie'; // Importing Cookies library for managing cookies

// Action creator for login
export const login_action = formValues => async dispatch => {
    // Logging formValues to console
    console.log('***', formValues.username);
    // Creating payload for login request
    var payload = JSON.stringify({
        user_email: formValues.username,
        user_password: formValues.password
    });
    // Dispatching action to show loader
    dispatch({ type: SHOW_LOADER });

    // Sending login request to server
    var response = await connect.post('/user-signin', payload, {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    });
    // Logging response data to console
    console.log(response.data);
    // Dispatching action to update state with login response
    dispatch({ type: LOGIN, payload: response.data });

    // Checking if response is valid
    if (response != null || response != 'undefined' || response != '') {
        // Setting token in cookie
        Cookies.set('token', response.data.token);
        // Dispatching action to hide loader
        dispatch({ type: HIDE_LOADER });
        // Redirecting based on user role
        if (response.data.success && response.data.user_role === 'admin') {
            history.push('/admin');
        } else if (response.data.success && response.data.user_role === 'customer') {
            history.push('/');
        }
    }
};

// Action creator for logout
export const logout_action = () => async dispatch => {
    // Dispatching action to show loader
    dispatch({ type: SHOW_LOADER });

    // Sending logout request to server
    var response = await connect.get('/user-signout', {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    });
    // Checking if response is valid
    if (response != null || response != 'undefined' || response != '') {
        // Dispatching action to hide loader
        dispatch({ type: HIDE_LOADER });
    }
    // Clearing local storage
    window.localStorage.clear();
    dispatch({ type: LOGOUT, payload: response.data });
    dispatch({ type: RESET });
    // Redirecting to home page
    history.push('/');
};

// Action creator for signup
export const signup_action = formValues => async dispatch => {
    // Logging formValues to console
    console.log('***', formValues);
    var payload = JSON.stringify({
        user_email: formValues.user_email,
        user_password: formValues.user_password,
        user_gender: formValues.user_gender.value,
        user_phone: formValues.user_phone,
        street_one: formValues.street_one,
        street_two: formValues.street_two,
        nearby: formValues.nearby,
        city: formValues.city,
        state: formValues.state,
        pin_code: formValues.pin_code,
    });

    // Dispatching action to show loader
    dispatch({ type: SHOW_LOADER });

    // Sending signup request to server
    var response = await connect.post('/user-signup', payload, {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    });
    // Logging response data to console
    console.log(response.data);
    dispatch({ type: SIGNUP, payload: response.data });

    // Checking if response is valid
    if (response != null || response != 'undefined' || response != '') {
        dispatch({ type: HIDE_LOADER });
        if (response.data.success === 'true') {
            console.log('DONE');
        }
    }
};

// Action creator for resetting form
export const reset_action = formValues => async dispatch => {
    dispatch({ type: RESET });
};
