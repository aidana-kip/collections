const { body } = require('express-validator');

const createCommentValidator = [
    body('comment').notEmpty().withMessage('Comment must be provided'),
    body('itemId').notEmpty().withMessage('Item id must be provided')
];

module.exports = { createCommentValidator: createCommentValidator }