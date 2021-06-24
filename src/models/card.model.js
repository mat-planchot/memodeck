const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
const Role = require('../utils/userRoles.utils');



/******************************************************************************
 *                              Card Model
 *
 * An element that contains the data as well as logic related to the data: validation,
 * reading and recording. It contain only a simple value, or a more complex data structure.
 * This model represents the inserts of new cards, the update or deletion of cards

 * Steps of all methods :
 *  1. Adding new cards
 *  2. Update cards
 *  3. Removal of cards
 *
 *  Description of the columns in the database :
 *
 * idcard: number of card [INT]
 * front: questions [TEXT]
 * back: answers [TEXT]
 * frontmedia: media (eg image, video, sound) for the front side of the card [TEXT]
 * backmedia: answers with media [TEXT]
 * fkdeck: foreign key that references the deck [INT]
 * nbreview: number of review done [INT]
 * issuspended: if the card is suspended it is true (1) [BOOLEAN]
 * difficulty: float number that decides the next review date by doing a multiplication
  with the nbdayreview . difficulty * nbdayreview = new nbdayreview and we determine the new review date [FLOAT]
 * nbdayreview: interval of days to the next review [INT]
 * reviewdate: date of review [DATE]
 *
 *
 **/


class CardModel {
    tableName = 'card'; /** TABLE NAME **/
    /**
     * get all the cards in the database with this data: idcard, front, back, frontmedia, backmedia, fkdeck, nbreview, issuspended, difficulty, nbdayreview, reviewdate
     */

    find = async (params = {}) => {
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

        const sql = `UPDATE card SET ${columnSet} WHERE idcard = ?`;

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

        const sql = `UPDATE card SET ${columnSet}, 
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
        // idcard, front, back, frontmedia, backmedia, fkdeck, nbreview, issuspended, difficulty, nbdayreview, reviewdate
        let sql = `SELECT * FROM ${this.tableName}
        WHERE card.fkdeck = ? AND reviewdate <= DATE(NOW())
        ORDER BY RAND() LIMIT 1`;

        const result = await query(sql, [fkdeck])

        // return back the first row (card)
        return result[0];
    }
    /**
     * get all daily review cards from a deck
     * @param fkdeck id of a deck
     */
    reviewCards = async (fkdeck) => {
        // idcard, front, back, frontmedia, backmedia, fkdeck, nbreview, issuspended, difficulty, nbdayreview, reviewdate
        let sql = `SELECT * FROM ${this.tableName}
        WHERE card.fkdeck = ? AND reviewdate <= DATE(NOW())`;

        return await query(sql, [fkdeck]);
    }
}

module.exports = new CardModel;