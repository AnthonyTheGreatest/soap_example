import DigestClient from 'digest-fetch';
import dotenv from 'dotenv';
dotenv.config();
// import {data} from './dataAlapTablak.js';

const client = new DigestClient(
  process.env.SOAP_USERNAME,
  process.env.SOAP_PASSWORD
);

const url = 'https://puphax.neak.gov.hu/PUPHAXWS';

export const makeRequest = async ({SOAPAction, xmlData}) => {
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
    return response.text();
  } catch (error) {
    console.log('Error making the request:', error);
  }
};

// console.log(await makeRequest(data.ATCKONYV));
