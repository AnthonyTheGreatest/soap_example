import { pool1 } from './pool.js';
import { data } from './1_AlapTablak/dataAlapTablak.js';
import { makeRequest } from './makeRequest.js';
import { parseResponse } from './1_AlapTablak/parseResponseAlapTablak.js';
import { doQuery } from './1_AlapTablak/doQueryAlapTablak.js';

const processData = async (table) => {
  const responseText = await makeRequest(table);
//   console.log(responseText);
  const responseData = parseResponse(responseText, table);
  // console.log(responseData);
  const queryResult = await doQuery(pool1, responseData, table);
  console.log(queryResult);
};

// processData(data.ATCKONYV); // kész
// processData(data.ISOKONYV); // kész
// processData(data.BNOKODOK); // Lapozás
// processData(data.BRAND); // kész
// processData(data.CEGEK); // kész
// processData(data.KIINTOR); // kész
// processData(data.SZAKVKODOK); // kész
// processData(data.ORVOSOK); // Lapozás
// processData(data.NICHE); // kész

(async () => {
    try {
        for (const table in data) {
            await processData(data[table]);
        }
        console.log('Done');  
    } catch (error) {
        console.log('An error occurred during processing:', error.message);
    } finally {
        pool1.end();
    }
})();
