// import product
const User = require('../models/user');

//import dotenv because we have to connect with the mongoDB
const dotenv = require('dotenv');

//connect with database
const connectDatabase = require('../config/database');

//import the products
const users = require('../data/user.json');
const {connect} =require('mongoose');

//setting up config file
dotenv.config({ path: 'backend/config/config.env' });

connectDatabase();

const seedUsers = async () => {
    try{
        //Delete all the data in the users schema in shopit database
        await User.deleteMany();
        console.log('Users are deleted');

        //insert all the data inside the user.json
        await User.insertMany(users);
        console.log('all users are added');

        process.exit();
    }
    catch(error){
        console.log(error.message);
        process.exit();
    }
}

seedUsers();