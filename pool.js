import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'testdb',
  password: process.env.DB_PASSWORD,
});