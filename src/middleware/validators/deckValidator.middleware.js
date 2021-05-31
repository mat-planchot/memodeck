const { body } = require('express-validator');

exports.createDeckSchema = [
    body('deckname')
        .exists()
        .withMessage('Deckname is required')
        .isLength({ min: 1 })
        .withMessage('Must not be empty'),
];

exports.updateDeckSchema = [
    body('deckname')
        .optional()
        .isLength({ min: 1 })
        .withMessage('Must be at least 1 chars long'),
    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide required field to update')
        .custom(value => {
            const updates = Object.keys(value);
            const allowUpdates = ['deckname'];
            return updates.every(update => allowUpdates.includes(update));
        })
        .withMessage('Invalid updates!')
];
