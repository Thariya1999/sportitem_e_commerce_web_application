// get express 
const express = require('express');

// make express app
const app = express();

// Import cookie parser
const cookieParser = require('cookie-parser')
const bodyparser = require('body-parser')
const fileUpload = require('express-fileupload')

//import error handler
const errorMiddleware = require('./middlewares/errors');

app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());



// Import Product routes
const products = require('./routes/product');

// Import User Routers
const user = require('./routes/auth');

// Import Order Routers
const order = require('./routes/order');

app.use('/api/v1',products)
app.use('/api/v1',user)
app.use('/api/v1',order)

//Middlewares to handle errors
app.use(errorMiddleware); 

module.exports = app;