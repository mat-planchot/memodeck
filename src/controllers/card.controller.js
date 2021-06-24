const CardModel = require('../models/card.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

/******************************************************************************
 *                              Card Controller
 *
 * The card controller receives the input from the routes, optionally validates 
 * it and then passes the input to the model.
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
     * get all the cards in the database
     */
    getAllCards = async (req, res, next) => { 
        // async should be put in front of a function declaration to expect 
        // the possibility of the await keyword being used to invoke 
        // asynchronous code
        let cardList = await CardModel.find();
        // if the list of cards is empty
        // throw an error with not found status "404"
        if (!cardList.length) { 
            throw new HttpException(404, 'Cards not found'); 
        }

        res.send(cardList); // return a list of cards
    };

    /**
     * get all cards from a deck
     * @param req.params.id id of a deck
     */
    getAllCardsFromDeck = async (req, res, next) => {
        let cardList = await CardModel.find({ fkdeck: req.params.id });

        if (!cardList.length) {
            throw new HttpException(404, 'Cards not found');
        }

        res.send(cardList);
    };

    /**
     * get card by its id
     * @param req.params.id id of a card
     */
    getCardById = async (req, res, next) => {
        const card = await CardModel.findOne({ idcard: req.params.id });

        if (!card) {
            throw new HttpException(404, 'Card not found');
        }

        res.send(card);
    };

    /**
     * get card by a body parameter
     * @param req.body
     */
    getCardBy = async (req, res, next) => {
        // check to limit to a single parameter 
        // in the case of routes /front and /back
        this.checkValidation(req);

        // findOne
        const card = await CardModel.findOne(req.body);

        if (!card) {
            throw new HttpException(404, 'Card not found');
        }

        res.send(card);
    };

    /**
     * get a random daily review card from a deck
     * @param req.params.iddeck id of a deck
     */
    getRandomReviewCard = async (req, res, next) => {
        this.checkValidation(req);

        const card = await CardModel.randomReviewCard(req.params.iddeck);

        if (!card) {
            throw new HttpException(404, 'Card not found');
        }

        res.send(card);
    };

    /**
     * get all daily review cards from a deck
     * @param req.param.iddeck id of a deck
     */
    getReviewCards = async (req, res, next) => {
        let cardList = await CardModel.reviewCards(req.params.iddeck);
        if (!cardList.length) {
            throw new HttpException(404, 'Cards not found');
        }

        res.send(cardList);
    };

    /**
     * Create a card with the body parameters
     * @param req.body
     */
    createCard = async (req, res, next) => {
        // check the datas send it is correct in the function
        this.checkValidation(req); 
        // creation of the card
        const result = await CardModel.create(req.body); 

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }
        // return a message with code status 201 for created card
        res.status(201).send('Card was created!'); 
    };

    /**
     * Update a card from its URL id parameter and body parameters
     * @param req.param.id
     * @param req.body
     */
    updateCard = async (req, res, next) => {
        this.checkValidation(req);

        const { confirm_password, ...restOfUpdates } = req.body;

        // do the update query and get the result
        // it can be partial edit
        const result = await CardModel.update(req.body, req.params.id);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'Card not found' :
            affectedRows && changedRows ? 'Card updated successfully' : 'Updated faild';

        res.send({ message, info });
    };

    /**
     * Update the review date of card from its URL id parameter and body parameters
     * @param req.param.id
     * @param req.body
     */
    updateReviewDate = async (req, res, next) => {
        // do the update query and get the result
        const result = await CardModel.updateReviewDate(req.body, req.params.id);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'Card not found' :
            affectedRows && changedRows ? 'Card updated successfully' : 'Updated faild';

        res.send({ message, info });
    };

    /**
     * Delete a card from its id
     * @param req.param.id
     */
    deleteCard = async (req, res, next) => {
        const result = await CardModel.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'Card not found');
        }
        res.send('Card has been deleted');
    };

    /**
     * Some function are protected by this function which checks
     * the parameters sent in the request
     */
    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation faild', errors);
        }
    }
}

module.exports = new CardController;