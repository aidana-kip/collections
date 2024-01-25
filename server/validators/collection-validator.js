const { body } = require('express-validator');

const createCollectionValidator = [
    body('name').notEmpty().withMessage('Name must be provided'),
    body('topic').isEmail().withMessage('Topic must be provided'),
    body('userId').notEmpty().withMessage('User id must be provided')
];

module.exports = { createCollectionValidator }