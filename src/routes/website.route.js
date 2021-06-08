const express = require('express');
const cardController = require('../controllers/card.controller');
const router = express.Router();

// localhost:3000/...
router.get('/', async (req, res) => {
    res.render('index', {title: "Accueil"})
});

router.get('/bot', async (req, res) => {
    res.render('chatbot', {cards, title: "Accueil"})
});

router.get('/login', async (req, res) => {
    const cards = [ { idcard: 1, front: "question", back: "réponse" } ]
    res.render('login', {cards, title: "Accueil"})
});

router.get('/signup', async (req, res) => {
    const cards = [ { idcard: 1, front: "question", back: "réponse" } ]
    res.render('signup', {cards, title: "Accueil"})
});

module.exports = router;