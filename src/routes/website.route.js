const express = require('express');
const cardController = require('../controllers/card.controller');
const router = express.Router();

// localhost:3000/...
router.get('/', async (req, res) => {
    let username = res.locals.username
    res.render('index', {title: "Accueil", token: res.locals.token, iduser: res.locals.iduser, username})
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