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
const singleTermekIdArr = [60300994];

const processData = async table => {
  const responseText = await makeRequest(table);
  // console.log(responseText);
  const responseData = parseResponse(responseText, table);
  if (table.name === 'TERMEK_ID_LIST') idList.push(...responseData);
  // console.log(responseData);
  const queryResult = await doQuery(pool, responseData, table);
  if (table.name !== 'TERMEK_ID_LIST') console.log(queryResult);
};

// TODO: convert to transaction
const processTermekIdList = async () => {
  for (const id of singleTermekIdArr) {
    // TERMEK:
    const responseTextTermek = await makeRequest({
      SOAPAction: data.TERMEK.SOAPAction,
      xmlData: data.TERMEK.xmlData(id),
    });
    const responseDataTermek = parseResponse(responseTextTermek, data.TERMEK);
    // TAMALAP_KATEGTAM_EUHOZZAR:
    const responseTextTamalap = await makeRequest({
      SOAPAction: data.TAMALAP_KATEGTAM_EUHOZZAR.SOAPAction,
      xmlData: data.TAMALAP_KATEGTAM_EUHOZZAR.xmlData(id),
    });
    const responseDataTamalap = parseResponse(
      responseTextTamalap,
      data.TAMALAP_KATEGTAM_EUHOZZAR
    );
    const eupontIdArr = responseDataTamalap[3];
    // EUPONTOK_EUINDIKACIOK_BNOHOZZAR_EUJOGHOZZAR:
    const responseEupontokArr = [];
    for (const eupontId of eupontIdArr) {
      const responseTextEupont = await makeRequest({
        SOAPAction: data.EUPONTOK_EUINDIKACIOK_BNOHOZZAR_EUJOGHOZZAR.SOAPAction,
        xmlData:
          data.EUPONTOK_EUINDIKACIOK_BNOHOZZAR_EUJOGHOZZAR.xmlData(eupontId),
      });
      const responseDataEupont = parseResponse(
        responseTextEupont,
        data.EUPONTOK_EUINDIKACIOK_BNOHOZZAR_EUJOGHOZZAR
      );
      responseEupontokArr.push(responseDataEupont);
    }
    // Queries:
    for (const eupontData of responseEupontokArr) {
      await doQuery(
        pool,
        eupontData,
        data.EUPONTOK_EUINDIKACIOK_BNOHOZZAR_EUJOGHOZZAR
      );
    }
    await doQuery(pool, responseDataTermek, data.TERMEK);
    await doQuery(pool, responseDataTamalap, data.TAMALAP_KATEGTAM_EUHOZZAR);
  }
  console.log('Done');
};

// await processTermekIdList();

// await processData(data.KIHIRDETES);

// Call one after the other:
// await processData(data.TERMEK_ID_LIST);
// await processTermekIdList();

// !
// Call in this order due to foreign key constraints:
// !

// await processData(data.EUPONTOK_EUINDIKACIOK_BNOHOZZAR_EUJOGHOZZAR);

// await processData(data.TERMEK);

await processData(data.TAMALAP_KATEGTAM_EUHOZZAR);

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
