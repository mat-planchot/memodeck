const CardModel = require('../models/card.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

/**
 *                              Card Controller
 * 
 * The card controller receives the input from the routes, optionally 
 * validates it and then passes the input to the model.
 * 
 * All methods have this three parameters
 * @param req for request
 * @param res for response
 * @param next for callback argument
 * 
 * Steps of all methods :
 *  1. Recover data from the model
 *  2. Verified data
 *  3. Send data to router
 * 
 **/
class CardController {

     /**
     * return a list of all the cards for a user
     */
    getAllCards = async (req, res, next) => { // async and await function allow to do some asynchrone request
        let cardList = await CardModel.find();
        if (!cardList.length) { // verified that list of cards is not empty
            throw new HttpException(404, 'Cards not found'); // return an error if the condition was false
        }

        cardList = cardList.map(card => { // map function transform object to array
            return card;
        });

        res.send(cardList); // return a list of cards
    };

    /**
     * return all cards related to deck
     */
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

    /**
     * return card by param id
     */
    getCardById = async (req, res, next) => {
        const card = await CardModel.findOne({ idcard: req.params.id });

        if (!card) {
            throw new HttpException(404, 'Card not found');
        }

        res.send(card);
    };

    /**
     * return card by param body
     */
    getCardBy = async (req, res, next) => {
        this.checkValidation(req); 

        const card = await CardModel.findOne(req.body);

        if (!card) {
            throw new HttpException(404, 'Card not found');
        }

        res.send(card);
    };

    /**
     * return card at current date by random selection
     */
    getRandomReviewCard = async (req, res, next) => {
        this.checkValidation(req);

        const card = await CardModel.randomReviewCard(req.body);

        if (!card) {
            throw new HttpException(404, 'Card not found');
        }

        res.send(card);
    };

    /**
     * return all cards at current date
     */
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

    /**
     * Allow to create a card
     */
    createCard = async (req, res, next) => {
        this.checkValidation(req); // check the data send in the function

        await this.hashPassword(req); // hash the password recieved

        const result = await CardModel.create(req.body); // creation of the card

        if (!result) {
            throw new HttpException(500, 'Something went wrong'); 
        }

        res.status(201).send('Card was created!'); // return a message with code status 201 for created card
    };

    /**
     * Allow to update card
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
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

    /**
     * Allow to delete a one card
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
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