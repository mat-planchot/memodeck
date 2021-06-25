/******************************************************************************
 * "body" refers to the http response body. We need this to check that the 
 * content has correctly been sent by the browser.
 */
const { body } = require('express-validator');

/**
 * This export like the others below, export a module, more precisely a 
 * ValidationChain from the package 'express-validator'.
 * For example with body('front'), the body response sent by the browser named 
 * 'front', we check if this parameter exists if not, there is the associated 
 * message 'Front is required' and we make also sure that the length is at
 * least 1 character long so it must not be empty.
 * Validations are quite easy to understand but custom a bit more complex.
 * There is no name in the body(). With custom(), we inspect all the value of
 * the body as a whole. Then we apply a custom javascript function.
 * For instance it is possible to parse the length of the body parameters and
 * if they should be in the body.
 * 
 * These validations are called according to the function they refer.
 */
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
        .withMessage('Must not be empty')
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