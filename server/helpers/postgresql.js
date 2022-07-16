const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DATABASE_USERNAME,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT)
});

const databaseQuery = async (query, values = []) => {
    let client = await pool.connect();
    try {
        const consulta = await client.query(query, values);
        client.release();
        return { code: 200, data: consulta.rows };
    } catch (error) {
        console.log(query);
        console.log(values);
        console.log(error.message);
        client.release();
        return { code: 500 };
    }
};

const databaseTransaction = async (query, values) => {
    let client = await pool.connect();
    try {
        await client.query('BEGIN');
        for(let index in query) {
            const queryText = query[index];
            const queryValues = values[index];
            await client.query(queryText, queryValues);
        }
        await client.query('COMMIT');
        return { code: 200 };
    } catch (error) {
        console.log(query);
        console.log(values);
        console.log(error.message);
        await client.query('ROLLBACK');
        return { code: 500 };
    } finally {
        client.release();
    }
};

module.exports = {
    databaseQuery,
    databaseTransaction
};