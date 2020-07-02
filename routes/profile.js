const express = require('express');
const {
	getMe,
	createProfile,
	updateProfile,
	getProfiles,
	getProfile,
	deleteProfile,
	addExperience,
	deleteExperience,
	addEducation,
	deleteEducation,
	getRepos,
} = require('../controllers/profile');
const { protect } = require('../middleware/auth');

const router = express.Router();

router
	.route('/')
	.get(getProfiles)
	.post(protect, createProfile)
	.put(protect, updateProfile)
	.delete(protect, deleteProfile);
router.route('/me').get(protect, getMe);
router.route('/:user_id').get(getProfile);
router.route('/experience').put(protect, addExperience);
router.route('/education').put(protect, addEducation);
router.route('/experience/:exp_id').delete(protect, deleteExperience);
router.route('/education/:edu_id').delete(protect, deleteEducation);
router.route('/github/:username').get(getRepos);

module.exports = router;
