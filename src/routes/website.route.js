const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const CardModel = require('../models/card.model');
const DeckModel = require('../models/deck.model');

router.get('/', async (req, res) => {
    const css = "/css/rotating-card.css"
    if(req.session.token === undefined){
        res.redirect('/login')
    }
    res.render('index', {title: "Accueil", css, session: req.session})
});

router.get('/bot', async (req, res) => {
    if(req.session.token === undefined){
        res.redirect('/login')
    }
    const cards = await CardModel.find({ fkdeck: req.query.iddeck })
    console.log(cards)
    const css = "/css/main.css"
    res.render('chatbot', {title: "MemoBot", css, cards: cards })
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
    if(req.session.token === undefined){
        res.redirect('/login')
    }
    const card = await CardModel.findOne({ idcard: req.query.idcard });
    const css = "/css/rotating-card.css"
    res.render('updatecard', {title: "Modifier la carte", css, idcard: req.query.idcard, card})
});

router.get('/deletedeck/:id', auth(), async (req, res) => {
    if(req.session.token === undefined){
        res.redirect('/login')
    }
    await DeckModel.delete(req.params.id);
    res.redirect('/')
});
router.get('/deletecard', auth(), async (req, res) => {
    if(req.session.token === undefined){
        res.redirect('/login')
    }
    await CardModel.delete(req.query.idcard);
    res.redirect('/')
});

router.get('/logout', async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/login')
    });
});

module.exports = router;