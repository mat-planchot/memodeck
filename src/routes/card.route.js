const express = require('express');
const router = express.Router();
const cardController = require('../controllers/card.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createCardSchema, updateCardSchema, frontCardSchema, backCardSchema } = require('../middleware/validators/cardValidator.middleware');

// localhost:3000/api/v1/cards/...
router.get('/', auth(), awaitHandlerFactory(cardController.getAllCards));
router.get('/id/:id', auth(), awaitHandlerFactory(cardController.getCardById)); // mandatory PARAM idcard
router.get('/deck/:id', auth(), awaitHandlerFactory(cardController.getAllCardsFromDeck)); // mandatory PARAM fkdeck
router.patch('/dayreview/:id', auth(), awaitHandlerFactory(cardController.updateReviewDate)); // mandatory POST nbdayreview, idcard
router.post('/reviewcards', auth(), awaitHandlerFactory(cardController.getReviewCards)); // mandatory POST fkdeck
router.post('/reviewcard', auth(), awaitHandlerFactory(cardController.getRandomReviewCard)); // mandatory POST fkdeck
router.post('/front', auth(), frontCardSchema, awaitHandlerFactory(cardController.getCardBy)); // mandatory POST front
router.post('/back', auth(), backCardSchema, awaitHandlerFactory(cardController.getCardBy)); // mandatory POST back
router.post('/', auth(), createCardSchema, awaitHandlerFactory(cardController.createCard)); // mandatory POST front, back and fkdeck
router.patch('/id/:id', auth(), updateCardSchema, awaitHandlerFactory(cardController.updateCard)); // mandatory PARAM idcard and at least one value
router.delete('/id/:id', auth(), awaitHandlerFactory(cardController.deleteCard)); // mandatory PARAM idcard

module.exports = router;