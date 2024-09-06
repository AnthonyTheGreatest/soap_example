import { data } from './2_NemAlap/dataNemAlap.js';
import { makeRequest } from './makeRequest.js';
import { parseResponse } from './2_NemAlap/parseResponseNemAlap.js';
import { doQuery } from './2_NemAlap/doQueryNemAlap.js';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});

const processData = async table => {
  const responseText = await makeRequest(table);
  // console.log(responseText);
  const responseData = parseResponse(responseText, table);
  // console.log(responseData);
  const queryResult = await doQuery(pool, responseData, table);
  const logMessage = queryResult ? `${table.name} - Rowcount: ${queryResult}` : `${table.name} - No rows inserted.`
  console.log(logMessage);
};

await processData(data.KIHIRDETES);

pool.end();
process.exit();
