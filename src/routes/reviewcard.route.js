const express = require('express');
const router = express.Router();
const reviewcardController = require('../controllers/reviewcard.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createReviewCardSchema, updateReviewCardSchema } = require('../middleware/validators/reviewcardValidator.middleware');

// localhost:3000/api/v1/reviewcards/...
router.get('/', auth(), awaitHandlerFactory(reviewcardController.getAllReviewCards));
router.get('/id/:id', auth(), awaitHandlerFactory(reviewcardController.getReviewCardById));
router.get('/idcard/:id', auth(), awaitHandlerFactory(reviewcardController.getReviewCardByIdCard));
router.post('/', auth(), createReviewCardSchema, awaitHandlerFactory(reviewcardController.createReviewCard));
router.patch('/id/:id', auth(), awaitHandlerFactory(reviewcardController.updateReviewCard));
router.delete('/id/:id', auth(), awaitHandlerFactory(reviewcardController.deleteReviewCard));

module.exports = router;