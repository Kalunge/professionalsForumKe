const axios = require('axios');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const normalize = require('normalize-url');

const Profile = require('../models/Profile');
const User = require('../models/User');
// const Post = require('../../models/Post');

// @route    GET api/v1/profile/me
// @desc     Get current users profile
// @access   Private
exports.getMe = asyncHandler(async (req, res, next) => {
	const profile = await Profile.findOne({
		user: req.user.id,
	}).populate('user', ['name', 'avatar']);

	if (!profile) {
		return next(new ErrorResponse(`There is no profile for this user`, 404));
	}

	res.status(200).json({
		success: true,
		data: profile,
	});
});

// @route    POST api/v1/v1/profile
// @desc     Create user profile
// @access   Private

exports.createProfile = asyncHandler(async (req, res, next) => {
	const {
		company,
		location,
		website,
		bio,
		skills,
		status,
		githubusername,
		youtube,
		twitter,
		instagram,
		linkedin,
		facebook,
	} = req.body;

	const profileFields = {
		user: req.user.id,
		company,
		location,
		website:
			website && website !== '' ? normalize(website, { forceHttps: true }) : '',
		bio,
		skills: Array.isArray(skills)
			? skills
			: skills.split(',').map((skill) => ' ' + skill.trim()),
		status,
		githubusername,
	};

	// Build social object and add to profileFields
	const socialfields = { youtube, twitter, instagram, linkedin, facebook };

	for (const [key, value] of Object.entries(socialfields)) {
		if (value && value.length > 0)
			socialfields[key] = normalize(value, { forceHttps: true });
	}

	profileFields.social = socialfields;

	let existingProfile = await Profile.findOne({ user: req.user.id });

	if (existingProfile) {
		return next(new ErrorResponse(`You have already created a profile`, 400));
	}

	const profile = await Profile.create(profileFields);

	res.status(201).json({
		success: true,
		data: profile,
	});
});

// @route    PUT api/v1/v1/profile/
// @desc     Update user profile
// @access   Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
	let profile = await Profile.findOne({ user: req.user.id });

	if (!profile) {
		return next(new ErrorResponse(`You have not created a profile yet`, 404));
	}

	profile = await Profile.findByIdAndUpdate(req.user.id, req.body, {
		new: true,
		runValidators: true,
	});

	profile = await Profile.findOneAndUpdate(
		{ user: req.user.id },
		{ $set: req.body },
		{ new: true, upsert: true }
	);

	console.log(profile);

	res.status(200).json({
		success: true,
		data: profile,
	});
});

// @route    GET api/v1/profile
// @desc     Get all profiles
// @access   Public
exports.getProfiles = asyncHandler(async (req, res) => {
	const profiles = await Profile.find().populate('user', ['name', 'avatar']);

	if (!profiles) {
		return next(new ErrorResponse(`No profiles found`, 404));
	}

	res.status(200).json({
		count: profiles.length,
		success: true,
		data: profiles,
	});
});

// @route    GET api/v1/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
exports.getProfile = asyncHandler(async (req, res, next) => {
	const profile = await Profile.findOne({
		user: req.params.user_id,
	}).populate('user', ['name', 'avatar']);

	if (!profile) {
		return next(
			new ErrorResponse(`No profile found by the id ${req.params.id}`),
			404
		);
	}

	res.status(200).json({
		success: true,
		data: profile,
	});
});

// @route    DELETE api/v1/profile
// @desc     Delete profile, user & posts
// @access   Private
exports.deleteProfile = asyncHandler(async (req, res, next) => {
	// *TODO
	// Remove user posts
	const profile = await Profile.findOne({ user: req.user.id });

	if (!profile) {
		return next(new ErrorResponse(`You have not created a profile yet`, 400));
	}
	// Remove profile
	profile.remove();
	// Remove user
	await User.findOneAndRemove({ _id: req.user.id });

	res.status(200).json({
		success: true,
		data: {},
	});
});

// @route    PUT api/v1/profile/experience
// @desc     Add profile experience
// @access   Private

exports.addExperience = asyncHandler(async (req, res, next) => {
	const { title, company, location, from, to, current, description } = req.body;

	const newExp = {
		title,
		company,
		location,
		from,
		to,
		current,
		description,
	};

	const profile = await Profile.findOne({ user: req.user.id });

	if (!profile) {
		return next(new ErrorResponse(`You have not created a profile yet`, 400));
	}

	profile.experience.unshift(newExp);

	await profile.save();

	res.status(201).json({
		success: true,
		data: profile,
	});
});

// @route    DELETE api/v1/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private

exports.deleteExperience = asyncHandler(async (req, res, next) => {
	const foundProfile = await Profile.findOne({ user: req.user.id });

	if (!foundProfile) {
		return next(new ErrorResponse(`You have not created a profile yet`, 400));
	}

	foundProfile.experience = foundProfile.experience.filter(
		(exp) => exp._id.toString() !== req.params.exp_id
	);

	await foundProfile.save();

	res.status(200).json({
		success: true,
		data: foundProfile,
	});
});

// @route    PUT api/v1/profile/education
// @desc     Add profile education
// @access   Private

exports.addEducation = asyncHandler(async (req, res, next) => {
	const {
		school,
		degree,
		fieldofstudy,
		from,
		to,
		current,
		description,
	} = req.body;

	const newEdu = {
		school,
		degree,
		fieldofstudy,
		from,
		to,
		current,
		description,
	};

	const profile = await Profile.findOne({ user: req.user.id });

	if (!profile) {
		return next(new ErrorResponse(`You have not created a profile yet`, 400));
	}

	profile.education.unshift(newEdu);

	await profile.save();

	res.status(201).json({
		success: true,
		data: profile,
	});
});

// @route    DELETE api/v1/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private

exports.deleteEducation = asyncHandler(async (req, res, next) => {
	const foundProfile = await Profile.findOne({ user: req.user.id });

	if (!foundProfile) {
		return next(new ErrorResponse(`You have not created a profile yet`, 400));
	}

	foundProfile.education = foundProfile.education.filter(
		(edu) => edu._id.toString() !== req.params.edu_id
	);

	await foundProfile.save();

	res.status(200).json({
		success: true,
		data: foundProfile,
	});
});

// @route    GET api/v1/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
exports.getRepos = asyncHandler(async (req, res) => {
	const uri = encodeURI(
		`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
	);

	const headers = {
		'user-agent': 'node.js',
		Authorization: `token ${process.env.githubToken}`,
	};

	const gitHubResponse = await axios.get(uri, { headers });

	if (!gitHubResponse.data) {
		return next(new ErrorResponse(`No github Profile found`, 404));
	}

	res.status(200).json({
		success: true,
		data: gitHubResponse.data,
	});
});
