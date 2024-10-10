// This file is for connect our application with Redux
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from'redux-thunk'; 

import {composeWithDevTools} from 'redux-devtools-extension'

// Ad reducer
import {productsReducer, productDetailsReducer, newProductReducer, productReducer} from './reducers/productReducers'
import { authReducer, userReducer, allUsersReducer } from './reducers/userReducers';


import { cartReducer } from './reducers/CartReducers';

const reducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducer,
    newProduct: newProductReducer,
    product: productReducer,
    auth: authReducer,
    allUsers: allUsersReducer,
    user: userReducer,
    cart: cartReducer 
})

// In here we include the things that want to load before application is load.
let initialState = {
    cart: {
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : []
    }
}

const middleware = [thunk];
const store = createStore(reducer,initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store;   