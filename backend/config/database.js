/// import mongoose
const mongoose = require('mongoose');

//create function to connect database mongoDB
const connectDatabase = () => {
    //connect mongoDB with server
    mongoose.connect("mongodb://localhost:27017",{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        //useCreateIndex: true  //this is not available in mongoose 6 and later versions
    }).then(() => console.log('MongoDB connection established.'))
}

module.exports = connectDatabase

