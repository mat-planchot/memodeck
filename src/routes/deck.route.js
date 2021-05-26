const express = require('express');
const router = express.Router();
const deckController = require('../controllers/deck.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createDeckSchema, updateDeckSchema } = require('../middleware/validators/deckValidator.middleware');


router.get('/', auth(), awaitHandlerFactory(deckController.getAllDecks)); // localhost:3000/api/v1/decks
router.get('/iddeck/:id', auth(), awaitHandlerFactory(deckController.getDeckById)); // localhost:3000/api/v1/decks/id/1
router.get('/deckname/:deckname', auth(), awaitHandlerFactory(deckController.getDeckBydeckName)); // localhost:3000/api/v1/decks/decksname/julia
router.get('/current', auth(), awaitHandlerFactory(deckController.getCurrentDeck)); // localhost:3000/api/v1/decks/whoami
router.post('/', createDeckSchema, awaitHandlerFactory(deckController.createDeck)); // localhost:3000/api/v1/decks
//router.patch('/id/:id', auth(Role.Apprenant), updateDeckSchema, awaitHandlerFactory(deckController.updateDeck)); // localhost:3000/api/v1/decks/id/1 , using patch for partial update
router.delete('/iddeck/:id', auth(Role.Apprenant), awaitHandlerFactory(deckController.deleteDeck)); // localhost:3000/api/v1/decks/id/1

module.exports = router;