const { body } = require('express-validator');

exports.createReviewCardSchema = [
    body('nbreview')
        .optional()
        .isInt()
        .withMessage('Must not be an int'),
    body('issuspended')
        .optional()
        .isBoolean()
        .withMessage('Must be a boolean'),
    body('difficulty')
        .optional()
        .isFloat()
        .withMessage('Must be a float'),
    body('nbdayreview')
        .optional()
        .isInt()
        .withMessage('Must not be an int'),
    body('reviewdate')
        .optional()
        .isString()
        .isLength({ min: 10, max: 10 })
        .withMessage('Must a string with exactly 10 characters for the date'),
    body('fkcard')
        .exists()
        .withMessage('fkcard is required')
        .isInt()
        .withMessage('Must not be an int'),
];

exports.updateReviewCardSchema = [
    body('nbreview')
        .optional()
        .isInt()
        .withMessage('Must not be an int'),
    body('issuspended')
        .optional()
        .isBoolean()
        .withMessage('Must be a boolean'),
    body('difficulty')
        .optional()
        .isFloat()
        .withMessage('Must be a float'),
    body('nbdayreview')
        .optional()
        .isInt()
        .withMessage('Must not be an int'),
    body('reviewdate')
        .optional()
        .isString()
        .isLength({ min: 10, max: 10 })
        .withMessage('Must be a string with exactly 10 characters for the date'),
    body('fkcard')
        .not().exists()
        .withMessage('fkcard is not allowed to be changed'),
    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide required field to update')
        .custom(value => {
            const updates = Object.keys(value);
            const allowUpdates = ['reviewcardname'];
            return updates.every(update => allowUpdates.includes(update));
        })
        .withMessage('Invalid updates!')
];
