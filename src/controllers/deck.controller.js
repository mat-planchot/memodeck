const DeckModel = require('../models/deck.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

/******************************************************************************
 *                              Deck Controller
 ******************************************************************************/
class DeckController {
    getAllDecks = async (req, res, next) => {
        let deckList = await DeckModel.find();
        if (!deckList.length) {
            throw new HttpException(404, 'Decks not found');
        }

        deckList = deckList.map(deck => {
            return deck;
        });

        res.send(deckList);
    };

    getDeckById = async (req, res, next) => {
        const deck = await DeckModel.findOne({ iddeck: req.params.id });
        if (!deck) {
            throw new HttpException(404, 'Deck not found');
        }

        res.send(deck);
    };

    getDeckBydeckName = async (req, res, next) => {
        const deck = await DeckModel.findOne({ deckname: req.params.deckname });
        if (!deck) {
            throw new HttpException(404, 'Deck not found');
        }

        res.send(deck);
    };

    getCurrentDeck = async (req, res, next) => {
        res.send(deck);
    };

    createDeck = async (req, res, next) => {
        this.checkValidation(req);

        await this.hashPassword(req);

        const result = await DeckModel.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Deck was created!');
    };

    updateDeck = async (req, res, next) => {
        this.checkValidation(req);

        await this.hashPassword(req);

        const { confirm_password, ...restOfUpdates } = req.body;

        // do the update query and get the result
        // it can be partial edit
        const result = await DeckModel.update(restOfUpdates, req.params.id);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'Deck not found' :
            affectedRows && changedRows ? 'Deck updated successfully' : 'Updated faild';

        res.send({ message, info });
    };

    deleteDeck = async (req, res, next) => {
        const result = await DeckModel.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'Deck not found');
        }
        res.send('Deck has been deleted');
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation faild', errors);
        }
    }

    // hash password if it exists
    hashPassword = async (req) => {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 8);
        }
    }
}

module.exports = new DeckController;