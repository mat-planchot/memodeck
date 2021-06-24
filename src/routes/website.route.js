const express = require('express');
const cardController = require('../controllers/card.controller');
const deckController = require('../controllers/deck.controller')
const router = express.Router();

// localhost:3000/...
router.get('/', async (req, res) => {
    let decks = deckController.getAllDecks();
    res.render('index', {title: "Accueil", session: req.session, deck: decks})
});

router.get('/bot', async (req, res) => {
    res.render('chatbot', {title: "MemoBot"})
});

router.get('/login', async (req, res) => {
    res.render('login', {title: "Connexion"})
});

router.get('/signup', async (req, res) => {
    res.render('signup', {title: "Inscription"})
});

module.exports = router;