const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const CardModel = require('../models/card.model');

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

router.get('/updatecard', auth(), async (req, res) => {
    const card = await CardModel.findOne({ idcard: req.query.idcard });
    const css = "/css/rotating-card.css"
    res.render('updatecard', {title: "Modifier la carte", css, idcard: req.query.idcard, card: card})
});

router.get('/deletecard', auth(), async (req, res) => {
    await CardModel.delete(req.query.idcard);
    const css = "/css/rotating-card.css"
    res.redirect('/')
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