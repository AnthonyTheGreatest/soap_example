// import { pool2 } from './pool.js';
import { data } from './2_NemAlap/dataNemAlap.js';
import { makeRequest } from './makeRequest.js';
import { parseResponse } from './2_NemAlap/parseResponseNemAlap.js';
import { doQuery } from './2_NemAlap/doQueryNemAlap.js';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'testdb',
  password: process.env.DB_PASSWORD,
});

const processData = async table => {
  const responseText = await makeRequest(table);
  // console.log(responseText);
  const responseData = parseResponse(responseText, table);
  // console.log(responseData);
  const queryResult = await doQuery(pool, responseData, table);
  if (table.name !== 'TERMEK_ID_LIST') console.log(queryResult);
};

// processData(data.KIHIRDETES);
// processData(data.TERMEK_ID_LIST);
processData(data.TERMEK);
// processData(data.EUPONTOK);
// pool.end();

// (async () => {
//     try {
//         for (const table in data) {
//             await processData(data[table]);
//         }
//         console.log('Done');
//     } catch (error) {
//         console.log('An error occurred during processing:', error.message);
//     } finally {
//         pool.end();
//     }
// })();
