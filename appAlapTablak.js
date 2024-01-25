import { data } from "./dataAlapTablak.js";
import { makeRequest } from "./makeRequestAlapTablak.js";
import { parseResponse } from "./parseResponseAlapTablak.js";
import { doQuery } from "./doQueryAlapTablak.js";

const responseText = await makeRequest(data.ATCKONYV);
// console.log(responseText);
const responseData = parseResponse(responseText, data.ATCKONYV);
// console.log(responseData);
const queryResult = await doQuery(responseData, data.ATCKONYV);
console.log(queryResult);
// process.exit(0);
