import { makeRequest } from './makeRequest.js';
import { parseResponse } from './parseResponse.js';
import { doQuery } from './doQuery.js';

const responseText = await makeRequest();
// // console.log(responseText);
const responseData = parseResponse(responseText);
// console.log(responseData);
const queryResult = await doQuery(responseData);
// const queryResult = await doQuery('lorazepam');
console.log(queryResult);
// process.exit(0);
