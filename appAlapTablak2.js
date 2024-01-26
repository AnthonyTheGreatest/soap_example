import { data } from "./dataAlapTablak.js";
import { makeRequest } from "./makeRequestAlapTablak.js";
import { parseResponse } from "./parseResponseAlapTablak.js";
import { doQuery } from "./doQueryAlapTablak2.js";

const processData = async table => {
    const responseText = await makeRequest(table);
    // console.log(responseText);
    const responseData = parseResponse(responseText, table);
    // console.log(responseData);
    const queryResult = await doQuery(responseData, table);
    console.log(queryResult);
};

// processData(data.ATCKONYV);
// processData(data.BNOKODOK);
// processData(data.NICHE);
processData(data.ISOKONYV);

// const processAll = async () => {
//     for (const table of data) {
//         await processData(table);
//     }
// };