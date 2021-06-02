const express = require('express');
const router = express.Router();
const cardController = require('../controllers/card.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createCardSchema, updateCardSchema, frontCardSchema, backCardSchema } = require('../middleware/validators/cardValidator.middleware');

// localhost:3000/api/v1/cards/...
router.get('/', auth(), awaitHandlerFactory(cardController.getAllCards));
router.get('/id/:id', auth(), awaitHandlerFactory(cardController.getCardById));
router.post('/reviewcards', auth(), awaitHandlerFactory(cardController.getReviewCards));
router.post('/reviewcard', auth(), awaitHandlerFactory(cardController.getRandomReviewCard));
router.post('/front', auth(), frontCardSchema, awaitHandlerFactory(cardController.getCardBy));
router.post('/back', auth(), backCardSchema, awaitHandlerFactory(cardController.getCardBy));
router.post('/', auth(), createCardSchema, awaitHandlerFactory(cardController.createCard));
router.patch('/id/:id', auth(), updateCardSchema, awaitHandlerFactory(cardController.updateCard));
router.delete('/id/:id', auth(), awaitHandlerFactory(cardController.deleteCard));

module.exports = router;