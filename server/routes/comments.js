const express = require('express');
const { body } = require('express-validator');
const { getComments, addComment, updateComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

const contentValidator = body('content')
  .trim()
  .notEmpty().withMessage('Comment cannot be empty')
  .isLength({ min: 1, max: 1000 }).withMessage('Comment must be 1–1000 characters');

// Mounted at /api/posts/:postId/comments
const postCommentsRouter = express.Router({ mergeParams: true });
postCommentsRouter.get('/',  getComments);
postCommentsRouter.post('/', protect, contentValidator, addComment);

// Mounted at /api/comments
const commentsRouter = express.Router();
commentsRouter.put('/:id',    protect, contentValidator, updateComment);
commentsRouter.delete('/:id', protect, deleteComment);

module.exports = { postCommentsRouter, commentsRouter };
