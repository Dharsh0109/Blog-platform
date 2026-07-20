const express = require('express');
const { body } = require('express-validator');
const { getPosts, getPost, createPost, updatePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const postValidators = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Title max 200 chars'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('coverImage').optional().isURL().withMessage('Cover image must be a valid URL'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
];

router.get('/',    getPosts);
router.get('/:id', getPost);
router.post('/',         protect, postValidators, createPost);
router.put('/:id',       protect, postValidators, updatePost);
router.delete('/:id',    protect, deletePost);

module.exports = router;
