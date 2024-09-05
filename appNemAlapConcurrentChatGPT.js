// 100 IDs - 2:02

import { data } from './2_NemAlap/dataNemAlap.js';
import { makeRequest } from './makeRequest.js';
import { parseResponse } from './2_NemAlap/parseResponseNemAlap.js';
import { doQuery } from './2_NemAlap/doQueryNemAlap.js';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import pLimit from 'p-limit';
import logDuration from './logDuration.js';

dotenv.config();

let startTime;

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  connectionLimit: 1000,
});

const idList = [];
const processedEupontIdArr = []; //TODO: not compatible with concurrent processing...

// Function to process a single `TERMEK_ID_LIST` request
const processDataWithXmlDataArgument = async (table, arg) => {
  try {
    const responseText = await makeRequest({
      SOAPAction: table.SOAPAction,
      xmlData: table.xmlData(arg),
    });
    const responseData = parseResponse(responseText, table);
    if (table.name === 'TERMEK_ID_LIST') idList.push(...responseData);
    if (!responseData.length) return;
    const queryResult = await doQuery(pool, responseData, table);
    if (table.name !== 'TERMEK_ID_LIST') console.log(queryResult);
  } catch (error) {
    console.error('Error processing XML data argument:', arg, error);
  }
};

// Function to process all `TERMEK_ID_LIST` requests concurrently
const processAllTermekIdLists = async () => {
  const promises = [];
  for (let i = 0; i <= 9; i++) {
    promises.push(processDataWithXmlDataArgument(data.TERMEK_ID_LIST, i));
  }
  await Promise.all(promises);
  console.log('Total number of IDs to be processed:', idList.length);
};

const processTermekId = async id => {
  try {
    console.log('Processing termek ID:', id);

    // 1. Process and insert TERMEK first (assuming TERMEK is the parent table)
    const responseTextTermek = await makeRequest({
      SOAPAction: data.TERMEK.SOAPAction,
      xmlData: data.TERMEK.xmlData(id),
    });
    const responseDataTermek = parseResponse(responseTextTermek, data.TERMEK);
    const rowCount = await doQuery(pool, responseDataTermek, data.TERMEK);
    console.log(rowCount);
    if (!(rowCount % 10)) {
      const endTime = new Date();
      logDuration(startTime, endTime);
    }

    // 2. Then process TAMALAP_KATEGTAM_EUHOZZAR (assuming it depends on TERMEK)
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

    // 3. Insert into the child tables EUPONTOK_EUINDIKACIOK_BNOHOZZAR_EUJOGHOZZAR
    const responseEupontokArr = [];
    for (const eupontId of eupontIdArr) {
      if (processedEupontIdArr.includes(eupontId)) continue;
      processedEupontIdArr.push(eupontId);
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
      await doQuery(
        pool,
        responseDataEupont,
        data.EUPONTOK_EUINDIKACIOK_BNOHOZZAR_EUJOGHOZZAR
      );
    }

    // 4. Finally, insert the TAMALAP_KATEGTAM_EUHOZZAR data if it's not empty
    if (!empty) {
      await doQuery(pool, responseDataTamalap, data.TAMALAP_KATEGTAM_EUHOZZAR);
    }

    console.log('Completed processing termek ID:', id);
  } catch (error) {
    console.error('Error processing termek ID:', id, error);
  }
};

// Function to process a single `termek ID`
// Does not work
const processTermekIdOld = async id => {
  try {
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
      if (processedEupontIdArr.includes(eupontId)) continue;
      processedEupontIdArr.push(eupontId);
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
    const queries = [];
    for (const eupontData of responseEupontokArr) {
      queries.push(
        doQuery(
          pool,
          eupontData,
          data.EUPONTOK_EUINDIKACIOK_BNOHOZZAR_EUJOGHOZZAR
        )
      );
    }
    queries.push(doQuery(pool, responseDataTermek, data.TERMEK));
    if (!empty) {
      queries.push(
        doQuery(pool, responseDataTamalap, data.TAMALAP_KATEGTAM_EUHOZZAR)
      );
    }

    await Promise.all(queries);

    // Log query result for termek table
    console.log('Completed processing termek ID:', id);
  } catch (error) {
    console.error('Error processing termek ID:', id, error);
  }
};

// Function to process all `termek IDs` concurrently
const processTermekIdList = async () => {
  const limit = pLimit(3);
  const promises = idList.map(id => limit(() => processTermekId(id)));
  await Promise.all(promises);
  console.log('All termek IDs processed');
};

// Main execution flow
await processAllTermekIdLists();
startTime = new Date();
await processTermekIdList();

// Close the pool and exit the process
pool.end();
process.exit();
