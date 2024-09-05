// import { pool2 } from './pool.js';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});

const [results] = await pool.execute(
  `SELECT MAX(ERV_DATUM) AS latest FROM KIHIRDETES WHERE STATUS = 'E'`
);
const iso = results[0].latest;
const date = new Date(iso);
date.setDate(date.getDate() + 1);
export const latestUpdate = date.toISOString().split('T')[0];

export const today = new Date().toISOString().split('T')[0];
