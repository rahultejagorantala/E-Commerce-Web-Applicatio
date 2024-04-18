import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import reduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore,applyMiddleware,compose } from 'redux';
import reducers from './reducers';
require('dotenv').config()

function getFromStorage(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key)) || {};
  } catch (err) {
    return {};
  }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const initialState = getFromStorage("APP_STATE");
const store = createStore( 
    reducers,
    initialState,
    composeEnhancers(applyMiddleware(reduxThunk))
  );
  store.subscribe(() => {
    window.localStorage.setItem("APP_STATE", JSON.stringify(store.getState()));
  });
ReactDOM.render(
    
    <Provider store={store}>
      <App />
    </Provider>,
    document.querySelector('#root')
  );
  