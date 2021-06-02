const ReviewCardModel = require('../models/reviewcard.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const auth = require('../middleware/auth.middleware');
dotenv.config();

/******************************************************************************
 *                              ReviewCard Controller
 ******************************************************************************/
class ReviewCardController {
    getAllReviewCards = async (req, res, next) => {
        let reviewcardList = await ReviewCardModel.find();
        if (!reviewcardList.length) {
            throw new HttpException(404, 'ReviewCards not found');
        }

        reviewcardList = reviewcardList.map(reviewcard => {
            return reviewcard;
        });

        res.send(reviewcardList);
    };

    getReviewCardById = async (req, res, next) => {
        const reviewcard = await ReviewCardModel.findOne({ idreviewcard: req.params.id });
        if (!reviewcard) {
            throw new HttpException(404, 'ReviewCard not found');
        }

        res.send(reviewcard);
    };

    getReviewCardByIdCard = async (req, res, next) => {
        const reviewcard = await ReviewCardModel.findOne({ fkcard: req.params.id });
        if (!reviewcard) {
            throw new HttpException(404, 'ReviewCard not found');
        }

        res.send(reviewcard);
    };

    getCurrentReviewCard = async (req, res, next) => {
        res.send(reviewcard);
    };

    createReviewCard = async (req, res, next) => {
        this.checkValidation(req);

        const result = await ReviewCardModel.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('ReviewCard was created!');
    };

    updateReviewCard = async (req, res, next) => {
        this.checkValidation(req);

        await this.hashPassword(req);

        const { confirm_password, ...restOfUpdates } = req.body;

        // do the update query and get the result
        // it can be partial edit
        const result = await ReviewCardModel.update(restOfUpdates, req.params.id);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'ReviewCard not found' :
            affectedRows && changedRows ? 'ReviewCard updated successfully' : 'Updated faild';

        res.send({ message, info });
    };

    deleteReviewCard = async (req, res, next) => {
        const result = await ReviewCardModel.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'ReviewCard not found');
        }
        res.send('ReviewCard has been deleted');
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

module.exports = new ReviewCardController;