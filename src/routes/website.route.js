const express = require('express');
const cardController = require('../controllers/card.controller');
const router = express.Router();

// localhost:3000/...
router.get('/', async (req, res) => {
    const css = "/css/rotating-card.css"
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
router.get('/logout', async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return console.log(err);
        }
        const css = "/css/login.css"
        res.redirect('login', {title: "Connexion", css})
    });
});

module.exports = router;