const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
const Role = require('../utils/userRoles.utils');

class CardModel {
    tableName = 'card';

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

    create = async ({ front, back, frontmedia=null, backmedia=null, fkdeck }) => {
        const sql = `INSERT INTO ${this.tableName}
        (front, back, frontmedia, backmedia, fkdeck) VALUES (?,?,?,?,?)`;

        const result = await query(sql, [front, back, frontmedia, backmedia, fkdeck]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    update = async (params, id) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE card SET ${columnSet} WHERE idcard = ?`;

        const result = await query(sql, [...values, id]);

        return result;
    }

    delete = async (id) => {
        const sql = `DELETE FROM ${this.tableName}
        WHERE idcard = ?`;
        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    randomReviewCard = async () => {

        const sql = `SELECT idcard, front, back, frontmedia, backmedia, fkdeck FROM ${this.tableName}
        INNER JOIN reviewcard ON card.idcard = reviewcard.fkcard
        WHERE reviewcard.reviewdate = DATE(NOW())
        ORDER BY RAND() LIMIT 1`;

        const result = await query(sql, [...values]);

        // return back the first row (card)
        return result[0];
    }

    reviewCards = async (params = {}) => {
        let sql = `SELECT idcard, front, back, frontmedia, backmedia, fkdeck FROM ${this.tableName}
        INNER JOIN reviewcard ON card.idcard = reviewcard.fkcard
        WHERE reviewcard.reviewdate = DATE(NOW())`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    }
}

module.exports = new CardModel;