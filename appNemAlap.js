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

const idList = [];

const processData = async table => {
  const responseText = await makeRequest(table);
  // console.log(responseText);
  const responseData = parseResponse(responseText, table);
  if (table.name === 'TERMEK_ID_LIST') idList.push(...responseData);
  console.log(responseData);
  // const queryResult = await doQuery(pool, responseData, table);
  // if (table.name !== 'TERMEK_ID_LIST') console.log(queryResult);
};

const processTermekIdList = async () => {
  for (const id of idList) {
    const responseText = await makeRequest({
      SOAPAction: data.TERMEK.SOAPAction,
      xmlData: data.TERMEK.xmlData(id),
    });
    const responseData = parseResponse(responseText, data.TERMEK);
    await doQuery(pool, responseData, data.TERMEK);
  }
  console.log('Done');
};

// await processData(data.KIHIRDETES);
// await processData(data.TERMEK_ID_LIST); //await is needed
// processData(data.TERMEK);
// processData(data.EUPONTOK);
await processData(data.TAMALAP_KATEGTAM_EUHOZZAR);
// await processTermekIdList();
pool.end();
process.exit();

// console.log(idList);

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
