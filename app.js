import { makeRequest } from "./makeRequest.js";
import { parseResponse } from "./parseResponse.js";
import { doQuery } from "./doQuery.js";

const responseText = await makeRequest();
// // console.log(responseText);
const elementText = parseResponse(responseText);
// // console.log(elementText);
const queryResult = await doQuery(elementText);
// const queryResult = await doQuery('lorazepam');
console.log(queryResult);
process.exit(0);
