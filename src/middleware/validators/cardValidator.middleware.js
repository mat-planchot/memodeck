const { body } = require('express-validator');


exports.createCardSchema = [
    body('front')
        .exists()
        .withMessage('Front is required')
        .isLength({ min: 1 })
        .withMessage('Must not be empty'),
    body('back')
        .exists()
        .withMessage('Back is required')
        .isLength({ min: 1 })
        .withMessage('Must not be empty'),
    body('frontmedia')
        .optional()
        .isLength({ min: 1 })
        .withMessage('Must not be empty'),
    body('backmedia')
        .optional()
        .isLength({ min: 1 })
        .withMessage('Must not be empty'),
];

exports.updateCardSchema = [
    body('front')
        .optional()
        .isLength({ min: 1 })
        .withMessage('Must not be empty'),
    body('back')
        .optional()
        .isLength({ min: 1 })
        .withMessage('Must not be empty'),
    body('frontmedia')
        .optional()
        .isLength({ min: 1 })
        .withMessage('Must not be empty'),
    body('backmedia')
        .optional()
        .isLength({ min: 1 })
        .withMessage('Must not be empty'),
    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide required field to update')
        .custom(value => {
            const updates = Object.keys(value);
            const allowUpdates = ['front', 'back', 'frontmedia', 'backmedia'];
            return updates.every(update => allowUpdates.includes(update));
        })
        .withMessage('Invalid updates!')
];

exports.frontCardSchema = [
    body('front')
        .exists()
        .withMessage('Front is required')
        .isLength({ min: 1 })
        .withMessage('Must not be empty')
];

exports.backCardSchema = [
    body('back')
        .exists()
        .withMessage('Back is required')
        .isLength({ min: 1 })
        .withMessage('Must not be empty')
];