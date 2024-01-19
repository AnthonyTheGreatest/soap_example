import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const doQuery = async (queryText) => {
    try {
        const pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            database: 'testdb',
            password: process.env.DB_PASSWORD,
        });
        const [results] = await pool.execute(
            'UPDATE `test_table` SET `name` = ? WHERE `id` = 2',
            // 'SELECT * FROM `test_table` WHERE `name` = ?',
            [queryText]
        );
        if (!results) {
            throw new Error(`No results found.`);
        }
        return results;
    } catch (error) {
        console.error('Error fetching data from MySQL:', error);
    }
};
