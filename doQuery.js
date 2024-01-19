import mysql from 'mysql2/promise';
// import dotenv from 'dotenv';
// dotenv.config();

export const doQuery = async (queryText) => {
    // const queryText = 'John';
    try {
        const pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            database: 'testdb',
            // password: process.env.DB_PASSWORD
            password: 'mysql'
        });
        const [results] = await pool.execute(
            'SELECT * FROM `test_table` WHERE `name` = ?',
            [queryText]
        );
        if (!results || !results.length) {
            throw new Error(`No results found.`);
        }
        return results;
    } catch (error) {
        console.error('Error fetching data from MySQL:', error);
    }
};
