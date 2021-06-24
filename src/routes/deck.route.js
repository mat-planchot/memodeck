const express = require('express');
const router = express.Router();
const deckController = require('../controllers/deck.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createDeckSchema, updateDeckSchema } = require('../middleware/validators/deckValidator.middleware');

// localhost:3000/api/v1/decks/...
router.get('/', auth(), awaitHandlerFactory(deckController.getAllDecks));
router.get('/user/:iduser', auth(), awaitHandlerFactory(deckController.getDecksFromUser)); // mandatory PARAM iduser
router.get('/:iddeck/user/:iduser', auth(), awaitHandlerFactory(deckController.getAllCardsFromDeckUser)); // mandatory PARAM iddeck and iduser
router.get('/id/:id', auth(), awaitHandlerFactory(deckController.getDeckById)); // mandatory PARAM iddeck
router.get('/deckname/:deckname', auth(), awaitHandlerFactory(deckController.getDeckBydeckName)); // mandatory PARAM deckname
router.post('/', auth(), createDeckSchema, awaitHandlerFactory(deckController.createDeck)); // mandatory POST deckname
router.patch('/id/:id', auth(), updateDeckSchema, awaitHandlerFactory(deckController.updateDeck)); // mandatory PARAM iddeck and at least one value
router.delete('/id/:id', auth(), awaitHandlerFactory(deckController.deleteDeck)); // mandatory PARAM iddeck

module.exports = router;