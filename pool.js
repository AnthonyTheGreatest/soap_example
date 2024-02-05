import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const pool1 = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'testdb',
  password: process.env.DB_PASSWORD,
});

export const pool2 = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'testdb',
  password: process.env.DB_PASSWORD,
});
