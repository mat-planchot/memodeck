const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
const Role = require('../utils/userRoles.utils');

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

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

        const result = await query(sql, [...values]);

        // return back the first row (deck)
        return result[0];
    }

    create = async ({ deckname, iduser }) => {
        const sql = `INSERT INTO ${this.tableName}
        (deckname, fkuser) VALUES (?,?)`;

        const result = await query(sql, [deckname, iduser]);
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