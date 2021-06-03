const express = require('express');
const router = express.Router();
const reviewcardController = require('../controllers/reviewcard.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createReviewCardSchema, updateReviewCardSchema } = require('../middleware/validators/reviewcardValidator.middleware');

// localhost:3000/api/v1/reviewcards/...
router.get('/', auth(), awaitHandlerFactory(reviewcardController.getAllReviewCards));
router.get('/id/:id', auth(), awaitHandlerFactory(reviewcardController.getReviewCardById)); // mandatory PARAM idreviewcard
router.get('/idcard/:id', auth(), awaitHandlerFactory(reviewcardController.getReviewCardByIdCard)); // mandatory PARAM idcard
router.post('/', auth(), createReviewCardSchema, awaitHandlerFactory(reviewcardController.createReviewCard)); // mandatory POST reviewdate, fkcard
router.patch('/id/:id', updateReviewCardSchema, auth(), awaitHandlerFactory(reviewcardController.updateReviewCard)); // mandatory PARAM idreviewcard and at least one value
router.delete('/id/:id', auth(), awaitHandlerFactory(reviewcardController.deleteReviewCard)); // mandatory PARAM idreviewcard

module.exports = router;