import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
});

const databaseName = 'testdb';

export const resetDatabase = async () => {
  try {
    await pool.execute(`DROP DATABASE IF EXISTS ${databaseName}`);
    await pool.execute(`CREATE SCHEMA ${databaseName}`);
    console.log('Database deleted and recreated. Next: call a createDatabase function.');
    await pool.end();
  } catch (error) {
    console.error('Query error:', error);
    await pool.end();
  }
};

resetDatabase();
