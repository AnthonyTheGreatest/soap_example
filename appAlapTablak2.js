import { data } from "./dataAlapTablak.js";
import { makeRequest } from "./makeRequestAlapTablak2.js";
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

// processData(data.ATCKONYV); // kész
// processData(data.ISOKONYV); // kész
// processData(data.BNOKODOK); // Lapozás
// processData(data.BRAND); // kész
// processData(data.CEGEK); // kész
// processData(data.KIINTOR); // kész
// processData(data.SZAKVKODOK); // kész
// processData(data.ORVOSOK); // Lapozás
// processData(data.NICHE); // kész

// const processAll = async () => {
//     for (const table of data) {
//         await processData(table);
//     }
// };