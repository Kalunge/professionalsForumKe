const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
		},
		text: {
			type: String,
			required: [true, 'Please add body to your post'],
		},
		name: {
			type: String,
		},
		avatar: {
			type: String,
		},
		likes: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
				},
			},
		],
		comments: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
				},
				text: {
					type: String,
					required: [true, 'Please add a comment'],
				},
				name: {
					type: String,
				},
				avatar: {
					type: String,
				},
				date: {
					type: Date,
					default: Date.now,
				},
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('post', PostSchema);
