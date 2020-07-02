const express = require('express');
const {
	createPost,
	getPosts,
	getPost,
	deletePost,
	editPost,
	likePost,
	unlikePost,
	commentOnPost,
	deleteComment,
} = require('../controllers/posts');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').post(protect, createPost).get(protect, getPosts);
router
	.route('/:id')
	.get(protect, getPost)
	.delete(protect, deletePost)
	.put(protect, editPost);
router.route('/likes/:id').put(protect, likePost);
router.route('/unlike/:id').put(protect, unlikePost);
router.route('/comment/:id').put(protect, commentOnPost);
router.route('/comment/:id/:comment_id').put(protect, deleteComment);
module.exports = router;
