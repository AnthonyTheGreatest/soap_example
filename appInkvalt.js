import { makeRequest } from './makeRequest.js';
import { data as dataInkvalt } from './3_Inkvalt/dataInkvalt.js';
import { parseResponse as parseResponseInkvalt } from './3_Inkvalt/parseResponseInkvalt.js';
import { data as dataAlapTablak } from './1_AlapTablak/dataAlapTablak.js';
import { parseResponse as parseResponseAlapTablak } from './1_AlapTablak/parseResponseAlapTablak.js';
import { doQuery as doQueryAlapTablak } from './1_AlapTablak/doQueryAlapTablak.js';
import { data as dataNemAlap } from './2_NemAlap/dataNemAlap.js';
import { parseResponse as parseResponseNemAlap } from './2_NemAlap/parseResponseNemAlap.js';
import { doQuery as doQueryNemAlap } from './2_NemAlap/doQueryNemAlap.js';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'testdb',
  password: process.env.DB_PASSWORD,
});

// AlapTablak:

const getInkvaltDataAlapTablak = async (tableArg, table) => {
  const responseText = await makeRequest({
    SOAPAction: dataInkvalt.INKVALT_TABLA.SOAPAction,
    xmlData: dataInkvalt.INKVALT_TABLA.xmlData(tableArg),
  });
  //   console.log(responseText);
  const responseData = parseResponseInkvalt(responseText, table);
  // console.log(responseData);
  return responseData;
};

const processDataAlapTablak = async (arg, table) => {
  const responseText = await makeRequest({
    SOAPAction: table.SOAPAction,
    xmlData: table.xmlDataInkvalt(arg),
  });
  // console.log(responseText);
  const responseData = parseResponseAlapTablak(responseText, table);
  // console.log(responseData);
  const queryResult = await doQueryAlapTablak(pool, responseData, table);
  console.log(queryResult);
};

(async () => {
  try {
    const inkvaltXmlTableArgs = [
      'TabATC',
      'TabISO',
      'TabBNO',
      'TabBrand',
      'TabCegek',
      'TabOSzakKep',
      'TabOrvKep',
    ];
    let argsIndex = 0;
    for (const table in dataAlapTablak) {
      // no inkvalt data for these tables:
      if (table === 'KIINTOR' || table === 'NICHE') continue;
      const responseDataInvalt = await getInkvaltDataAlapTablak(
        inkvaltXmlTableArgs[argsIndex],
        dataInkvalt.INKVALT_TABLA
      );
      argsIndex++;
      if (!responseDataInvalt.length) continue;
      for (const data of responseDataInvalt) {
        await processDataAlapTablak(data, dataAlapTablak[table]);
      }
    }
  } catch (error) {
    console.error(error.message);
  }
})();

// NemAlap:
// "
// Az IDLIST az azonosító szám előtt egy előjelet is tartalmazhat. Ez segíti a változás feldolgozását. Ezek jelentése:
// •	új termék, előjel:		+
// •	megszűnt termék, előjel:	-
// •	változott termékadatok, előjel nincs
// "

const getInkvaltDataNemAlap = async (arg, table) => {
  const responseText = await makeRequest({
    SOAPAction: dataInkvalt.INKVALT_TERMEK_IDS.SOAPAction,
    xmlData: dataInkvalt.INKVALT_TERMEK_IDS.xmlData(arg),
  });
  // console.log(responseText);
  const responseData = parseResponseInkvalt(responseText, table);
  // console.log(responseData);
  return responseData;
};

const getnewIdList = async () => {
  const newIdList = [];
  const responseDataInkvaltWithArgOne = await getInkvaltDataNemAlap(
    'G',
    dataInkvalt.INKVALT_TERMEK_IDS
  );
  newIdList.push(...responseDataInkvaltWithArgOne);
  const responseDataInkvaltWithArgTwo = await getInkvaltDataNemAlap(
    'S',
    dataInkvalt.INKVALT_TERMEK_IDS
  );
  newIdList.push(...responseDataInkvaltWithArgTwo);
  return newIdList;
};

const sortIdList = idList => {
  const newIds = [];
  const changedIds = [];
  const deletedIds = [];
  for (const id of idList) {
    if (id[0] === '+') newIds.push(id.slice(1));
    else if (id[0] === '-') deletedIds.push(id.slice(1));
    else changedIds.push(id);
  }
  return { newIds, changedIds, deletedIds };
};

// TODO: fix
const removeTermekIds = async idList => {
  try {
    for (const id of idList) {
      console.log('Deleting termek ID:', id);
      await pool.execute(`DELETE FROM termek WHERE ID = ${id}`);
    }
  } catch (error) {
    console.log('Error deleting termek ID list:', error);
  }
};

const addTermekIds = async idList => {
  try {
    for (const id of idList) {
      console.log('Processing termek ID:', id);
      // TERMEK:
      const responseTextTermek = await makeRequest({
        SOAPAction: dataNemAlap.TERMEK.SOAPAction,
        xmlData: dataNemAlap.TERMEK.xmlData(id),
      });
      const responseDataTermek = parseResponseNemAlap(
        responseTextTermek,
        dataNemAlap.TERMEK
      );
      // TAMALAP_KATEGTAM_EUHOZZAR:
      const responseTextTamalap = await makeRequest({
        SOAPAction: dataNemAlap.TAMALAP_KATEGTAM_EUHOZZAR.SOAPAction,
        xmlData: dataNemAlap.TAMALAP_KATEGTAM_EUHOZZAR.xmlData(id),
      });
      const responseDataTamalap = parseResponseNemAlap(
        responseTextTamalap,
        dataNemAlap.TAMALAP_KATEGTAM_EUHOZZAR
      );
      const empty = responseDataTamalap[0][0].ID === 999999999.999999;
      const eupontIdArr = responseDataTamalap[3];
      // EUPONTOK_EUINDIKACIOK_BNOHOZZAR_EUJOGHOZZAR:
      const responseEupontokArr = [];
      for (const eupontId of eupontIdArr) {
        // check if eupontId is already in database to avoid duplicate entries
        const [results] = await pool.execute(
          `SELECT * FROM eupontok WHERE ID = ${eupontId}`
        );
        if (results.length) continue;
        const responseTextEupont = await makeRequest({
          SOAPAction:
            dataNemAlap.EUPONTOK_EUINDIKACIOK_BNOHOZZAR_EUJOGHOZZAR.SOAPAction,
          xmlData:
            dataNemAlap.EUPONTOK_EUINDIKACIOK_BNOHOZZAR_EUJOGHOZZAR.xmlData(
              eupontId
            ),
        });
        const responseDataEupont = parseResponseNemAlap(
          responseTextEupont,
          dataNemAlap.EUPONTOK_EUINDIKACIOK_BNOHOZZAR_EUJOGHOZZAR
        );
        responseEupontokArr.push(responseDataEupont);
      }
      // Queries:
      for (const eupontData of responseEupontokArr) {
        await doQueryNemAlap(
          pool,
          eupontData,
          dataNemAlap.EUPONTOK_EUINDIKACIOK_BNOHOZZAR_EUJOGHOZZAR
        );
      }
      const queryResult = await doQueryNemAlap(
        pool,
        responseDataTermek,
        dataNemAlap.TERMEK
      );
      // Log query result (row count) for termek table only:
      console.log(queryResult);
      if (!empty) {
        await doQueryNemAlap(
          pool,
          responseDataTamalap,
          dataNemAlap.TAMALAP_KATEGTAM_EUHOZZAR
        );
      }
    }
  } catch (error) {
    console.log('Error processing termek ID list:', error);
  } finally {
    console.log('Done');
  }
};

(async () => {
  try {
    const idList = await getnewIdList();
    const { newIds, changedIds, deletedIds } = sortIdList(idList);
    const idsToDelete = changedIds.concat(deletedIds);
    const idsToAdd = newIds.concat(changedIds);
    await removeTermekIds(idsToDelete);
    await addTermekIds(idsToAdd);
  } catch (error) {
    console.error(error.message);
  }
})();
