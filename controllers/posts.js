const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Post = require('../models/Post');
const User = require('../models/User');

// @route    POST api/posts
// @desc     Create a post
// @access   Private
exports.createPost = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	if (!user) {
		return next(
			new ErrorResponse(`You need to be logged in to create a post`, 400)
		);
	}

	const newPost = await Post.create({
		text: req.body.text,
		name: user.name,
		avatar: user.avatar,
		user: req.user.id,
	});

	res.status(201).json({
		success: true,
		data: newPost,
	});
});

// @route    GET api/posts
// @desc     Get all posts
// @access   Private
exports.getPosts = asyncHandler(async (req, res, next) => {
	const posts = await Post.find().sort({ date: -1 });
	if (!posts) {
		return next(new ErrorResponse(`No posts found at the moment`, 404));
	}

	res.status(200).json({
		success: true,
		count: posts.length,
		data: posts,
	});
});

// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private
exports.getPost = asyncHandler(async (req, res, next) => {
	const post = await Post.findById(req.params.id);

	if (!post) {
		return next(
			new ErrorResponse(`post not found with the id ${req.params.id}`, 404)
		);
	}

	res.status(200).json({
		success: true,
		data: post,
	});
});

// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
exports.deletePost = asyncHandler(async (req, res, next) => {
	const post = await Post.findById(req.params.id);

	if (!post) {
		return next(
			new ErrorResponse(`No post found with the id ${req.params.id}`, 404)
		);
	}

	// Check post ownership
	if (post.user.toString() !== req.user.id) {
		return next(
			new ErrorResponse(`You are not authorized to delete this post`, 401)
		);
	}

	await post.remove();

	res.status(200).json({
		success: true,
		data: {},
	});
});

//  @route   PUT api/posts/:id
// @desc     Update a post
// @access   Private
exports.editPost = asyncHandler(async (req, res, next) => {
	const post = await Post.findById(req.params.id);

	if (!post) {
		return next(
			new ErrorResponse(`No post found with the id ${req.params.id}`, 404)
		);
	}

	// Check post ownership
	if (post.user.toString() !== req.user.id) {
		return next(
			new ErrorResponse(`You are not authorized to delete this post`, 401)
		);
	}

	await Post.findOneAndUpdate(req.params.id, req.body, {
		runValidators: true,
		new: true,
	});

	res.status(200).json({
		success: true,
		data: post,
	});
});

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
exports.likePost = asyncHandler(async (req, res, next) => {
	const post = await Post.findById(req.params.id);

	// Check if the post has already been liked
	if (post.likes.some((like) => like.user.toString() === req.user.id)) {
		return next(new ErrorResponse(`Post already liked`, 400));
	}

	post.likes.unshift({ user: req.user.id });

	await post.save();

	res.status(201).json({
		success: true,
		count: post.likes.length,
		data: post.likes,
	});
});

// @route    PUT api/posts/unlike/:id
// @desc     Unlike a post
// @access   Private
exports.unlikePost = asyncHandler(async (req, res, next) => {
	const post = await Post.findById(req.params.id);

	// Check if the post has not yet been liked
	if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
		return next(new ErrorResponse(`Post has not yet been liked`, 400));
	}

	// remove the like
	post.likes = post.likes.filter(({ user }) => user.toString() !== req.user.id);

	await post.save();

	res.status(200).json({
		success: true,
		count: post.likes.length,
		data: post.likes,
	});
});

// @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private

exports.commentOnPost = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id);
	const post = await Post.findById(req.params.id);

	if (!post) {
		return next(
			new ErrorResponse(`No post found with the id ${req.params.id}`, 404)
		);
	}

	const newComment = {
		text: req.body.text,
		name: user.name,
		avatar: user.avatar,
		user: req.user.id,
	};

	post.comments.unshift(newComment);

	await post.save();

	res.status(200).json({
		success: true,
		count: post.comments.length,
		data: post.comments,
	});
});

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
exports.deleteComment = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.id);

	// Pull out comment
	const comment = post.comments.find(
		(comment) => comment.id === req.params.comment_id
	);

	// Make sure comment exists
	if (!comment) {
		return next(new ErrorResponse(`That comment does not exists`, 404));
	}
	// Check user
	if (comment.user.toString() !== req.user.id) {
		return next(`You are not authorized to delete this comment`, 401);
	}

	post.comments = post.comments.filter(
		({ id }) => id !== req.params.comment_id
	);

	await post.save();

	res.status(200).json({
		success: true,
		count: post.comments.length,
		data: post.comments,
	});
});
