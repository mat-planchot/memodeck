const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');

class DeckModel {
    tableName = 'deck';

    find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    }

    findCards = async (params = {}) => {
        // iddeck, deckname, fkuser
        // idcard, front, back, frontmedia, backmedia, fkdeck, nbreview, issuspended, difficulty, nbdayreview, reviewdate
        let sql = `SELECT * FROM ${this.tableName}
        INNER JOIN card ON card.fkdeck = deck.iddeck
        WHERE deck.iddeck = ? AND deck.fkuser = ?`

        return await query(sql, [params.iddeck, params.fkuser]);
    }

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

        const result = await query(sql, [...values]);

        // return back the first row (deck)
        return result[0];
    }

    create = async ({ deckname, fkuser }) => {
        const sql = `INSERT INTO ${this.tableName}
        (deckname, fkuser) VALUES (?,?)`;

        const result = await query(sql, [deckname, fkuser]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    update = async (params, id) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE deck SET ${columnSet} WHERE iddeck = ?`;

        const result = await query(sql, [...values, id]);

        return result;
    }

    delete = async (id) => {
        const sql = `DELETE FROM ${this.tableName}
        WHERE iddeck = ?`;
        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }
}

module.exports = new DeckModel;