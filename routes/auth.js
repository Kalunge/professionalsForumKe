const express = require('express');
const {
	register,
	login,
	getMe,
	forgotPassowrd,
	resetPassowrd,
	updateDetails,
	updatePassword,
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassowrd);
router.put('/resetpassword/:resettoken', resetPassowrd);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
