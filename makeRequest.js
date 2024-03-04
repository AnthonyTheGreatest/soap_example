// Works with accented letters.

import DigestClient from 'digest-fetch';
import dotenv from 'dotenv';
dotenv.config();

const client = new DigestClient(
  process.env.SOAP_USERNAME,
  process.env.SOAP_PASSWORD
);

const url = 'https://puphax.neak.gov.hu/PUPHAXWS';

export const makeRequest = async ({ SOAPAction, xmlData }) => {
  const maxRetries = 5;
  const retryInterval = 5000;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await client.fetch(url, {
        method: 'POST',
        body: xmlData,
        headers: {
          'Accept-Encoding': 'gzip,deflate',
          'Content-Type': 'text/xml;charset=UTF-8',
          SOAPAction: SOAPAction,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const buffer = await response.arrayBuffer();
      const decoder = new TextDecoder('iso-8859-2');
      const decoded = decoder.decode(buffer);
      return decoded;
      // return response.text();
    } catch (error) {
      console.log(`Attempt ${attempt} failed. Error: ${error.message}`);
      if (attempt < maxRetries) {
        console.log(`Retrying in ${retryInterval / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryInterval));
      } else {
        console.log('Maximum retries reached. Error making the request:', error);
      }
    }
  }
};
