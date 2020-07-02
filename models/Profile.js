const mongoose = require('mongoose');
const ProfileSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		company: {
			type: String,
		},
		website: {
			type: String,
		},
		location: {
			type: String,
		},
		status: {
			type: String,
			required: [true, 'Please add your current status'],
		},
		skills: {
			type: [String],
			required: [true, 'Please add your current skills'],
		},
		bio: {
			type: String,
		},
		githubusername: {
			type: String,
		},
		experience: [
			{
				title: {
					type: String,
					required: [true, 'Please add your current title'],
				},
				company: {
					type: String,
					required: [true, 'Please add your current company'],
				},
				location: {
					type: String,
				},
				from: {
					type: Date,
					required: [
						true,
						'Please add the date you started working in this company',
					],
				},
				to: {
					type: Date,
				},
				current: {
					type: Boolean,
					default: false,
				},
				description: {
					type: String,
				},
			},
		],
		education: [
			{
				school: {
					type: String,
					required: [true, 'Please add the name of your school'],
				},
				degree: {
					type: String,
					required: [true, 'Please add the degree you acquired in this school'],
				},
				fieldofstudy: {
					type: String,
					required: [true, 'Please add your field of study'],
				},
				from: {
					type: Date,
					required: [true, 'Please add the start date'],
				},
				to: {
					type: Date,
				},
				current: {
					type: Boolean,
					default: false,
				},
				description: {
					type: String,
				},
			},
		],
		social: {
			youtube: {
				type: String,
			},
			twitter: {
				type: String,
			},
			facebook: {
				type: String,
			},
			linkedin: {
				type: String,
			},
			instagram: {
				type: String,
			},
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Profile', ProfileSchema);
