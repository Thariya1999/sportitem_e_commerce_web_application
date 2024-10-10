const express =require('express');
const router = express.Router();

const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserProfile, updatePassword, updateProfile, allUsers, getuserDetails, updateUser, deleteUser } = require('../controllers/authController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth') 

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/me').get(isAuthenticatedUser, getUserProfile);
router.route('/password/update').put(isAuthenticatedUser, updatePassword);
router.route('/me/update').put(isAuthenticatedUser, updateProfile);
router.route('/admin/users').get(isAuthenticatedUser, allUsers);
router.route('/admin/users/:id').get(isAuthenticatedUser, authorizeRoles('admin'), getuserDetails);
router.route('/admin/user/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateUser);
router.route('/admin/user/:id').delete(isAuthenticatedUser, deleteUser);

module.exports = router;