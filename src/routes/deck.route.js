const express = require('express');
const router = express.Router();
const deckController = require('../controllers/deck.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createDeckSchema, updateDeckSchema } = require('../middleware/validators/deckValidator.middleware');

// localhost:3000/api/v1/decks/...
router.get('/', auth(), awaitHandlerFactory(deckController.getAllDecks));
router.get('/id/:id', auth(), awaitHandlerFactory(deckController.getDeckById));
router.get('/deckname/:deckname', auth(), awaitHandlerFactory(deckController.getDeckBydeckName));
router.post('/', auth(), createDeckSchema, awaitHandlerFactory(deckController.createDeck));
router.patch('/id/:id', auth(), updateDeckSchema, awaitHandlerFactory(deckController.updateDeck));
router.delete('/id/:id', auth(), awaitHandlerFactory(deckController.deleteDeck));

module.exports = router;