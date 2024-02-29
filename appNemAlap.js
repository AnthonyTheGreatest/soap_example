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
  connectionLimit: 100,
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

const processedEupontIdArr = [];

// TODO: convert to transaction (remove) (?):

// TODO: program hangs after a while (?)
// TODO: remove logging
const processTermekIdList = async () => {
  try {
    for (const id of idList) {
      // skip ids...
      // if (
      //   id === 60300994 ||
      //   id === 60301017 ||
      //   id === 60301018 ||
      //   id === 60301052
      // )
      //   continue;
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
      // if (id === 60301053) {
      //   console.log('responseDataTermek:', responseDataTermek);
      //   const [result] = await pool.execute('SELECT COUNT(ID) AS ID_COUNT FROM TERMEK');
      //   console.log('Pool still open:', result[0].ID_COUNT);
      // }
      // Why does the program hang here after fully processing 4 termekIds?
      await doQuery(pool, responseDataTermek, data.TERMEK);
      const tamalapQueryResult = await doQuery(
        pool,
        responseDataTamalap,
        data.TAMALAP_KATEGTAM_EUHOZZAR
      );
      // Log query result (row count) for tamalap table only
      console.log(tamalapQueryResult);
    }
  } catch (error) {
    console.log('Error processing termek ID list:', error);
  } finally {
    console.log('Done');
  }
};

// await processData(data.KIHIRDETES);

// Call one after the other:
await processData(data.TERMEK_ID_LIST);
console.log('Ids to be processed:', idList);
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
