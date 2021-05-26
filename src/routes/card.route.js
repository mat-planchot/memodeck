const express = require('express');
const router = express.Router();
const cardController = require('../controllers/card.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createCardSchema, updateCardSchema } = require('../middleware/validators/cardValidator.middleware');


router.get('/', auth(), awaitHandlerFactory(cardController.getAllCards)); // localhost:3000/api/v1/cards
router.get('/id/:id', auth(), awaitHandlerFactory(cardController.getCardById)); // localhost:3000/api/v1/cards/id/1
router.get('/cardname/:cardname', auth(), awaitHandlerFactory(cardController.getCardBycardName)); // localhost:3000/api/v1/cards/cardsname/julia
router.get('/current', auth(), awaitHandlerFactory(cardController.getCurrentCard)); // localhost:3000/api/v1/cards/whoami
router.post('/', createCardSchema, awaitHandlerFactory(cardController.createCard)); // localhost:3000/api/v1/cards
router.patch('/id/:id', auth(Role.Admin), updateCardSchema, awaitHandlerFactory(cardController.updateCard)); // localhost:3000/api/v1/cards/id/1 , using patch for partial update
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(cardController.deleteCard)); // localhost:3000/api/v1/cards/id/1

module.exports = router;