const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
const Role = require('../utils/userRoles.utils');

/******************************************************************************
 *                              Card Model
 *
 * CardModel is a class that contains the logic related to the data: 
 * get, create update and remove cards. 
 * 
 * This class contains methods to :
 *  1. Get a card or a list of cards: find, findOne, randomReviewCard, reviewCards
 *  2. Add a new card: create
 *  3. Update a card: update, updateReviewDate
 *  4. Remove a card: delete
 *
 *  Description of the columns in the database :
 *
 * @param idcard [INT]: identifier of the card
 * @param front [TEXT]: front side of the card used to put the question
 * @param back [TEXT]: front side of the card used to put the answer
 * @param frontmedia [TEXT]: media (eg image, video, sound) for the front side of the card
 * @param backmedia [TEXT]: media (eg image, video, sound) for the back side of the card
 * @param fkdeck [INT]: foreign key that references the deck
 * @param nbreview [INT]: number of review done
 * @param issuspended [BOOLEAN]: if the card is suspended it is true (1) 
 * @param difficulty [FLOAT(6,2)]: float number that decides the next review date 
 * by doing a multiplication with the nbdayreview. 
 * difficulty * nbdayreview = new nbdayreview and we determine the new review date 
 * @param nbdayreview [INT]: interval of days to the next review
 * @param reviewdate [DATE]: date of review 
 *
 *
 **/


class CardModel {
    tableName = 'card';
    /**
     * get all the cards in the database 
     */
    find = async (params = {}) => {
        // select columns: idcard, front, back, frontmedia, backmedia, fkdeck, nbreview, issuspended, difficulty, nbdayreview, reviewdate
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    }

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)

        // select columns: idcard, front, back, frontmedia, backmedia, fkdeck, nbreview, issuspended, difficulty, nbdayreview, reviewdate
        const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

        const result = await query(sql, [...values]);

        // return back the first row (card)
        return result[0];
    }

    /**
     * Create a card with the body parameters
     * @param front
     * @param back
     * @param frontmedia
     * @param backmedia
     * @param fkdeck
     * @param nbreview
     * @param issuspended
     * @param difficulty
     * @param nbdayreview
     * @param reviewdate
     */
    create = async ({ front, back, frontmedia=null, backmedia=null, fkdeck, nbreview=1, issuspended=0, difficulty=1, nbdayreview=1, reviewdate=null }) => {
        const sql = `INSERT INTO ${this.tableName}
        (front, back, frontmedia, backmedia, fkdeck, 
        nbreview, issuspended, difficulty, nbdayreview, reviewdate) 
        VALUES (?,?,?,?,?,?,?,?,?,?)`;

        const result = await query(sql, [front, back, frontmedia, backmedia, fkdeck, nbreview, issuspended, difficulty, nbdayreview, reviewdate]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }
    /**
     * Update a card from its URL id parameter and body parameters
     * @param id
     * @param params
     */
    update = async (params, id) => {
        const { columnSet, values } = multipleColumnSet(params)

        // columnSet for partial edit
        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE idcard = ?`;

        const result = await query(sql, [...values, id]);

        return result;
    }
    /**
     * Update the review date of card from its URL id parameter and body parameters
     * @param id
     * @param params
     */
    updateReviewDate = async (params, id) => {
        const { columnSet, values } = multipleColumnSet(params)

        // it can be partial edit but it must contain the number of days to the next review (nbdayreview)
        const sql = `UPDATE ${this.tableName} SET ${columnSet}, 
        reviewdate = (NOW() + INTERVAL ? DAY)
        WHERE idcard = ?`;

        const result = await query(sql, [...values, params.nbdayreview, id]);

        return result;
    }
    /**
     * Delete a card from its id
     * @param id
     */
    delete = async (id) => {
        const sql = `DELETE FROM ${this.tableName}
        WHERE idcard = ?`;
        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }
    /**
     * get a random daily review card from a deck
     * @param fkdeck id of a deck
     */
    randomReviewCard = async (fkdeck) => {
        // select columns: idcard, front, back, frontmedia, backmedia, fkdeck, nbreview, issuspended, difficulty, nbdayreview, reviewdate
        // the review date have to be before or the current day
        // limit to one row (equal one card) order by the randomization of the current query
        let sql = `SELECT * FROM ${this.tableName}
        WHERE card.fkdeck = ? AND reviewdate <= DATE(NOW())
        ORDER BY RAND() LIMIT 1`;

        const result = await query(sql, [fkdeck])

        // return the first row, the only card of the sql request
        return result[0];
    }
    /**
     * get all daily review cards from a deck
     * @param fkdeck id of a deck
     */
    reviewCards = async (fkdeck) => {
        // select columns: idcard, front, back, frontmedia, backmedia, fkdeck, nbreview, issuspended, difficulty, nbdayreview, reviewdate
        let sql = `SELECT * FROM ${this.tableName}
        WHERE card.fkdeck = ? AND reviewdate <= DATE(NOW())`;

        return await query(sql, [fkdeck]);
    }
}

module.exports = new CardModel;