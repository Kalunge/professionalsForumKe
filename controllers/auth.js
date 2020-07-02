const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const normalize = require('normalize-url');
const gravatar = require('gravatar');

// @desc  Register User
// route  POST /api/v1/auth/register
// access Public

exports.register = asyncHandler(async (req, res, next) => {
	const { email, password, name } = req.body;

	const avatar = normalize(
		gravatar.url(email, {
			s: '200',
			r: 'pg',
			d: 'mm',
		}),
		{ forceHttps: true }
	);

	//Add user
	const user = await User.create({
		email,
		name,
		email,
		password,
		avatar,
	});

	sendTokenResponse(user, 200, res);
});

// @desc  login User
// route  POST /api/v1/auth/login
// access Public

exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	// Validate Email and Password
	if (!email || !password) {
		return next(
			new ErrorResponse(`Please provide an email and a password`),
			400
		);
	}
	// Check for user
	const user = await User.findOne({ email }).select('+password');
	if (!user) {
		return next(new ErrorResponse(`invalid credentials`), 401);
	}
	// ceck password match
	const isMatch = await user.matchPassword(password);

	if (!isMatch) {
		return next(new ErrorResponse(`invalid credentials`), 401);
	}

	sendTokenResponse(user, 200, res);
});

// Get token from model create cookie and send response

const sendTokenResponse = (user, statusCode, res) => {
	// Create Token
	const token = user.getSignedJwtToken();

	options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === 'productions') {
		options.secure = true;
	}

	res.status(statusCode).cookie('token', token, options).json({
		success: true,
		token,
	});
};

// @desc  Get current loggedin User
// route  POST /api/v1/auth/Me
// access Private

exports.getMe = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({
		success: true,
		data: user,
	});
});

// @desc  update details for logged in users
// route  PUT /api/v1/auth/updateDetails
// access Private

exports.updateDetails = asyncHandler(async (req, res, next) => {
	const updateFields = {
		name: req.body.name,
		email: req.body.email,
	};

	const user = await User.findByIdAndUpdate(req.user.id, updateFields, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: user,
	});
});

// @desc  update Password
// route  Put /api/v1/auth/updatepassword
// access Private

exports.updatePassword = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id).select('+password');

	// check whether current password matches entered password
	if (!(await user.matchPassword(req.body.currentPassword))) {
		return next(new ErrorResponse(`incorrect password`), 401);
	}

	user.password = req.body.newPassword;

	sendTokenResponse(user, 200, res);
});

// @desc  Forgot password
// route  POST /api/v1/auth/forgotpassword
// access Public

exports.forgotPassowrd = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return next(new ErrorResponse(`no user founder with tht email`), 404);
	}

	const resetToken = user.getResetPasswordToken();

	console.log(resetToken);
	await user.save({ validateBeforeSave: false });

	// create resetUrl
	const resetUrl = `${req.protocol}://${req.get(
		'host'
	)}/api/v1/auth/resetpassword/${resetToken}`;

	const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
	try {
		await sendEmail({
			email: user.email,
			subject: 'password reset email',
			message: message,
		});
		res.status(200).json({ success: true, data: 'email sent successfully' });
	} catch (err) {
		console.log(err);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save({ validateBeforeSave: false });
		return next(new ErrorResponse('email could not be sent'), 500);
	}
});

// @desc  reset password
// route  POST /api/v1/auth/resetpassword/:resettoken
// access Private

exports.resetPassowrd = asyncHandler(async (req, res, next) => {
	// get hashed token
	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(req.params.resettoken)
		.digest('hex');

	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	});

	if (!user) {
		return next(new ErrorResponse(`invalid token`), 400);
	}

	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;

	await user.save();

	sendTokenResponse(user, 200, res);
});
