const express = require('express');
const { body } = require('express-validator');
const { getPosts, getPost, createPost, updatePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const postValidators = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be 3–200 characters'),
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('coverImage')
    .optional({ checkFalsy: true })
    .isURL().withMessage('Cover image must be a valid URL'),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array')
    .custom((tags) => tags.every((t) => typeof t === 'string' && t.length <= 30))
    .withMessage('Each tag must be a string under 30 characters'),
];

router.get('/',       getPosts);
router.get('/:id',    getPost);
router.post('/',      protect, postValidators, createPost);
router.put('/:id',    protect, postValidators, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
