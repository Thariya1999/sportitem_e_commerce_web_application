// Import User model
const User = require('../models/user');

// Import Errror handler
const ErrorHandler = require('../utils/errorHandler');

// Import async error handler
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Import cookie creator
const sendToken = require('../utils/jwtToken');

// Import send Email file
const sendEmail = require('../utils/sendEmail');

// Import crypto for forget password recovery and send token to the user
const crypto = require('crypto');
const cloudinary = require('cloudinary');


//  Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors( async (req, res, next) => {
    
    const result = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:'avatars',
        width: 150,
        crop: "scale"
    })
    
    // Get user enter data
    const { name, email, password } = req.body;

    // Create new user
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
        }
    })

    sendToken(user, 200, res)
})



// Login User => /api/v1/login
exports.loginUser = catchAsyncErrors( async (req, res, next) => {
    // user have to provide email and password to login
    const { email, password } = req.body;

    // Check whether email and password are entered or not by user
    if (!email || !password){
        return next(new ErrorHandler('Please entter email and password', 400))
    } 

    // Finding user in database
    // we select password because in the user model we unselect the password
    const user = await User.findOne({ email }).select('+password')

    if (!user){
        // 401 means un authenticate user
        return next(new ErrorHandler('Invalid email or password', 401))
    }
    
    // check if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched){
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    sendToken(user, 200, res)
})


// Forgot Password
exports.forgotPassword = catchAsyncErrors( async (req, res, next) => {
    // Check user entered email is exist in database
    const user = await User.findOne({email: req.body.email});

    if(!user){
        return next(new ErrorHandler('User is not found with this email', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    
    await user.save({ validateBeforeSave: false })

    // Create Reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    // create user display message
    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\n If you have not requested this email, then ignore it.`

    try{
        // Create send email
        await sendEmail({
            // email of the user
            email: user.email, 
            subject: 'Fitman Sport password Recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })
    }
    catch (error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false })

        return next(new ErrorHandler(error.message, 500));
    }
})

// Reset Password
exports.resetPassword = catchAsyncErrors( async (req, res, next) => {
    // Hash the URL token and compare it with the one inside the database
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() } 
    })
    // Check user exist
    if (!user){
        return next(new ErrorHandler('password reset token is invalid or has been expired', 400));
    }
    //  check the matching of the confirm password
    if (req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('password does not match', 400));
    }

    // setup new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
})

// Get the details of currently logged user
exports.getUserProfile = catchAsyncErrors( async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})

// Update or change password of logged user.  This is not forget password case
exports.updatePassword = catchAsyncErrors( async (req, res, next) => {
    // get the user and specially select the password
    const user = await User.findById(req.user.id).select('+password');

    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if (!isMatched){
        return next(new ErrorHandler('Old password is incorrect!!!', 400));
    }

    // set user new password 
    user.password = req.body.password;
    await user.save();

    //  Send new token
    sendToken(user, 200, res);
})

// update user profile
exports.updateProfile = catchAsyncErrors( async (req, res, next) => {
   // setting new user data
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    
    // Update avatar
    if (req.body.avatar !== '') {
        const user = await User.findById(req.user.id)

        const image_id = user.avatar.public_id;
        const res = await cloudinary.v2.uploader.destroy(image_id);

        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: "scale"
        })

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }
    }

   // find the logged user and update
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
    success: true
    })
})

// Logout User
exports.logoutUser = catchAsyncErrors( async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged Out'
    })
})


// ADMIN ROUTES

// Get all users
exports.allUsers= catchAsyncErrors( async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})

// Get user details by ID
exports.getuserDetails = catchAsyncErrors( async (req, res, next) => {
    // Get user by ID
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`user not found with this id: ${req.params.id}`));
    }

    res.status(200).json({
        success: true,
        user
    })
})

// update user profile by admin using user id
exports.updateUser = catchAsyncErrors( async (req, res, next) => {
    // setting new user data
     const newUserData = {
         name: req.body.name,
         email: req.body.email,
         role: req.body.role
     // Update image TO DO !!!
     }
 
    // find the logged user and update
     const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
         new: true,
         runValidators: true,
         useFindAndModify: false
     })
 
     res.status(200).json({
     success: true
     })
 })

 // delete user by admin using user id
 exports.deleteUser = catchAsyncErrors( async (req, res, next) => {
    // Get user by ID
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`user not found with this id: ${req.params.id}`));
    }

    // remove avatar from cloudenary - TO DO !!!

    await User.findByIdAndRemove(req.params.id, {
        useFindAndModiy: false
    });

    res.status(200).json({
        success: true
    })
})