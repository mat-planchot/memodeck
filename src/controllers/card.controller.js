const CardModel = require('../models/card.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

/******************************************************************************
 *                              Card Controller
 ******************************************************************************/
class CardController {
    getAllCards = async (req, res, next) => {
        let cardList = await CardModel.find();
        if (!cardList.length) {
            throw new HttpException(404, 'Cards not found');
        }

        cardList = cardList.map(card => {
            return card;
        });

        res.send(cardList);
    };

    getAllCardsFromDeck = async (req, res, next) => {
        let cardList = await CardModel.find({ fkdeck: req.params.id });
        if (!cardList.length) {
            throw new HttpException(404, 'Cards not found');
        }

        cardList = cardList.map(card => {
            return card;
        });

        res.send(cardList);
    };

    getCardById = async (req, res, next) => {
        const card = await CardModel.findOne({ idcard: req.params.id });
        if (!card) {
            throw new HttpException(404, 'Card not found');
        }

        res.send(card);
    };

    getCardBy = async (req, res, next) => {
        this.checkValidation(req);

        const card = await CardModel.findOne(req.body);

        if (!card) {
            throw new HttpException(404, 'Card not found');
        }

        res.send(card);
    };

    getRandomReviewCard = async (req, res, next) => {
        this.checkValidation(req);

        const card = await CardModel.randomReviewCard(req.body);

        if (!card) {
            throw new HttpException(404, 'Card not found');
        }

        res.send(card);
    };

    getReviewCards = async (req, res, next) => {
        let cardList = await CardModel.reviewCards(req.body);
        if (!cardList.length) {
            throw new HttpException(404, 'Cards not found');
        }

        cardList = cardList.map(card => {
            return card;
        });

        res.send(cardList);
    };

    createCard = async (req, res, next) => {
        this.checkValidation(req);

        await this.hashPassword(req);

        const result = await CardModel.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Card was created!');
    };

    updateCard = async (req, res, next) => {
        this.checkValidation(req);

        await this.hashPassword(req);

        const { confirm_password, ...restOfUpdates } = req.body;

        // do the update query and get the result
        // it can be partial edit
        const result = await CardModel.update(restOfUpdates, req.params.id);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'Card not found' :
            affectedRows && changedRows ? 'Card updated successfully' : 'Updated faild';

        res.send({ message, info });
    };

    deleteCard = async (req, res, next) => {
        const result = await CardModel.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'Card not found');
        }
        res.send('Card has been deleted');
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

module.exports = new CardController;