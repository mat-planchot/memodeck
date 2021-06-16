const express = require('express');
const cardController = require('../controllers/card.controller');
const router = express.Router();

// localhost:3000/...
router.get('/', async (req, res) => {
    let username = res.locals.username
    const css = "/css/main.css"
    res.render('index', {title: "Accueil", css, session: req.session})
});

router.get('/bot', async (req, res) => {
    const css = "/css/main.css"
    res.render('chatbot', {title: "MemoBot", css})
});

router.get('/login', async (req, res) => {
    const css = "/css/login.css"
    res.render('login', {title: "Connexion", css})
});

router.get('/signup', async (req, res) => {
    const css = "/css/login.css"
    res.render('signup', {title: "Inscription", css})
});

module.exports = router;