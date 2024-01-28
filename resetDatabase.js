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
    // await pool.execute(`CREATE SCHEMA ${databaseName}`);
    await pool.execute(
      `CREATE SCHEMA ${databaseName} DEFAULT CHARACTER SET utf8 COLLATE utf8_hungarian_ci`
    );
    console.log(
      'Database (schema) deleted and recreated. Next: create database structure.'
    );
    await pool.end();
  } catch (error) {
    console.error('Query error:', error);
    await pool.end();
  }
};

resetDatabase();
