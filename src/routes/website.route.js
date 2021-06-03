const express = require('express');
const router = express.Router();

// localhost:3000/...
router.get('/', async (req, res) => {
    const cards = [ { idcard: 1, front: "question", back: "réponse" } ]
    res.render('index', {cards, title: "Accueil"})
});

module.exports = router;