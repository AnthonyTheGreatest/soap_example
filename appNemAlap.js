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
  // TODO: connectionLimit?
  connectionLimit: 1000,
});

const idList = [];
// const singleTermekIdArr = [60300994];

const processData = async table => {
  const responseText = await makeRequest(table);
  // console.log(responseText);
  const responseData = parseResponse(responseText, table);
  if (table.name === 'TERMEK_ID_LIST') idList.push(...responseData);
  // console.log(responseData);
  const queryResult = await doQuery(pool, responseData, table);
  if (table.name !== 'TERMEK_ID_LIST') console.log(queryResult);
};

const processDataWithXmlDataArgument = async (table, arg) => {
  const responseText = await makeRequest({
    SOAPAction: table.SOAPAction,
    xmlData: table.xmlData(arg),
  });
  // console.log(responseText);
  const responseData = parseResponse(responseText, table);
  if (table.name === 'TERMEK_ID_LIST') idList.push(...responseData);
  // console.log(responseData);
  // (no data = [])
  if (!responseData.length) return;
  const queryResult = await doQuery(pool, responseData, table);
  if (table.name !== 'TERMEK_ID_LIST') console.log(queryResult);
};

const processedEupontIdArr = [];

const processTermekIdList = async () => {
  try {
    for (const id of idList) {
      console.log('Processing termek ID:', id);
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
      const empty = responseDataTamalap[0][0].ID === 999999999.999999;
      const eupontIdArr = responseDataTamalap[3];
      // EUPONTOK_EUINDIKACIOK_BNOHOZZAR_EUJOGHOZZAR:
      const responseEupontokArr = [];
      for (const eupontId of eupontIdArr) {
        if (processedEupontIdArr.includes(eupontId)) continue; // avoid duplicate entries in eupontok table
        processedEupontIdArr.push(eupontId); // avoid duplicate entries
        const responseTextEupont = await makeRequest({
          SOAPAction:
            data.EUPONTOK_EUINDIKACIOK_BNOHOZZAR_EUJOGHOZZAR.SOAPAction,
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
      const queryResult = await doQuery(pool, responseDataTermek, data.TERMEK);
      // Log query result (row count) for termek table only:
      console.log(queryResult);
      if (!empty) {
        await doQuery(
          pool,
          responseDataTamalap,
          data.TAMALAP_KATEGTAM_EUHOZZAR
        );
      }
    }
  } catch (error) {
    console.log('Error processing termek ID list:', error);
  } finally {
    console.log('Done');
  }
};

// await processData(data.KIHIRDETES);
// console.log('Waiting for 5 seconds...');
// await new Promise(resolve => setTimeout(resolve, 5000));

// Call one after the other (with static xmlData):
// await processData(data.TERMEK_ID_LIST);
// console.log('Number of IDs to be processed:', idList.length);
// await processTermekIdList();

for (let i = 0; i <= 9; i++) {
  await processDataWithXmlDataArgument(data.TERMEK_ID_LIST, i);
  console.log('xmlData argument:', i);
  console.log('Number of IDs in list:', idList.length);
};
console.log('Total number of IDs to be processed:', idList.length);
await processTermekIdList();


// await processTermekIdList();

// !
// Call (with static xmlData) in this order due to foreign key constraints:
// !

// await processData(data.EUPONTOK_EUINDIKACIOK_BNOHOZZAR_EUJOGHOZZAR);

// await processData(data.TERMEK);

// await processData(data.TAMALAP_KATEGTAM_EUHOZZAR);

pool.end();
process.exit();
