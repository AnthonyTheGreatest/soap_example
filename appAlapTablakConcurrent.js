import { pool1 } from './pool.js';
import { data } from './1_AlapTablak/dataAlapTablak.js';
import { makeRequest } from './makeRequest.js';
import { parseResponse } from './1_AlapTablak/parseResponseAlapTablak.js';
import { doQuery } from './1_AlapTablak/doQueryAlapTablak.js';
import logDuration from './logDuration.js';
import pLimit from 'p-limit';

const limit = pLimit(3);

const processData = async table => {
  const responseText = await makeRequest(table);
  //   console.log(responseText);
  const responseData = parseResponse(responseText, table);
  // console.log(responseData);
  const queryResult = await doQuery(pool1, responseData, table);
  console.log(queryResult);
};

const processDataWithXmlDataArgument = async (table, arg) => {
  const responseText = await makeRequest({
    SOAPAction: table.SOAPAction,
    xmlData: table.xmlData(arg),
  });
  // console.log(responseText);
  const responseData = parseResponse(responseText, table);
  // console.log(responseData);
  // (no data = [])
  if (!responseData.length) return;
  const queryResult = await doQuery(pool1, responseData, table);
  console.log(queryResult);
};

// Call with static xmlData (for testing):

// processData(data.ATCKONYV);
// processData(data.ISOKONYV);
// processData(data.BNOKODOK);
// processData(data.BRAND);
// processData(data.CEGEK);
// processData(data.KIINTOR);
// processData(data.SZAKVKODOK);
// processData(data.ORVOSOK);
// processData(data.NICHE);

(async () => {
  try {
    const startTime = new Date();
    const promises = [];
    for (const table in data) {
      if (table === 'BNOKODOK' || table === 'ORVOSOK') {
        // Pass numbers 0-9 to the xmlData function
        for (let i = 0; i < 10; i++) {
          //   await processDataWithXmlDataArgument(data[table], i);
          promises.push(
            limit(() => processDataWithXmlDataArgument(data[table], i))
          );
        }
        if (table === 'BNOKODOK') {
          // Pass letters A-Z also
          for (
            let letter = 'A';
            letter <= 'Z';
            letter = String.fromCharCode(letter.charCodeAt(0) + 1)
          ) {
            promises.push(
              limit(() => processDataWithXmlDataArgument(data[table], letter))
            );
          }
        }
        continue;
      }
      promises.push(limit(() => processData(data[table])));
    }
    await Promise.all(promises);
    const endTime = new Date();
    logDuration(startTime, endTime);
  } catch (error) {
    console.log('An error occurred during processing:', error.message);
  } finally {
    pool1.end();
  }
})();
