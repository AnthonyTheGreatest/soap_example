import { DOMParser } from '@xmldom/xmldom';

export const parseResponse = (responseText, { name, columns }) => {
  const xmlDoc = new DOMParser().parseFromString(responseText, 'text/xml');
  let data;
  // const valuesToIntOrString 
  switch (name) {
    case 'KIHIRDETES':
      data = Array.from(xmlDoc.getElementsByTagName('OBJKIHIRDELEM')).map(
        row => {
          const rowObject = {};
          Array.from(row.childNodes).forEach(node => {
            if (node.nodeName === 'ELETBELEP') {
              rowObject[columns[0]] = node.textContent;
            } else if (node.nodeName === 'STATUS') {
              rowObject[columns[1]] = node.textContent;
            } else if (node.nodeName === 'VER') {
              rowObject[columns[2]] = node.textContent;
            }
          });
          return rowObject;
        }
      );
      break;
    case 'TERMEK_ID_LIST':
      // type: integer[]
      data = Array.from(xmlDoc.getElementsByTagName('SZOVEG')).map(id =>
        parseInt(id.textContent)
      );
      break;
    case 'TERMEK':
      data = Array.from(xmlDoc.getElementsByTagName('OBJTERMEKADAT')).map(
        row => {
          const rowObject = {};
          Array.from(row.childNodes).forEach(node => {
            const columnIndex = columns.indexOf(node.nodeName);
            if (columnIndex !== -1) {
              const nodeValue = node.textContent;
              rowObject[columns[columnIndex]] = isNaN(Number(nodeValue))
                ? nodeValue
                : Number(nodeValue);
            }
          });
          return rowObject;
        }
      );
      break;
    case 'TAMALAP_KATEGTAM_ETC':
      data = [[]];
      const element = Array.from(xmlDoc.getElementsByTagName('OBJTAMOGAT'))[0];
      // TAMALAP:
      const tamalap = {};
      Array.from(element.childnodes).forEach(node => {
        if (node.nodeName === 'TAMOGATASOK') {
          return;
        }
        const nodeValue = node.textContent;
        tamalap[node.nodeName] = isNaN(Number(nodeValue))
          ? nodeValue
          : Number(nodeValue);
      });
      data[0].push(tamalap);
      // KATEGTAM:
      const kategtam = Array.from(
        xmlDoc.getElementsByTagName('OBJKATEGTAM')
      ).map(row => {
        const rowObject = {};
        Array.from(row.childNodes).forEach(node => {
          const nodeValue = node.textContent;
          rowObject[node.nodeName] = isNaN(Number(nodeValue))
            ? nodeValue
            : Number(nodeValue);
        });
        return rowObject;
      });
      data.push(kategtam);
      // TODO: ETC
      break;
    case 'EUPONTOK_EUINDIKACIOK_BNOHOZZAR_EUJOGHOZZAR':
      data = {};
      data.eupontok = {};
      const eupontArr = Arry.from(xmlDoc.querySelector('OBJEUPONT').childNodes);
      eupontArr.forEach(node => {
        if (
          node.nodeName !== 'INDIKACIOK' ||
          node.nodeName !== 'FELIRBNO' ||
          node.nodeName !== 'FELIRHAT'
        ) {
          const nodeValue = node.textContent;
          data.eupontok[node.nodeName] = isNaN(Number(nodeValue))
            ? nodeValue
            : Number(nodeValue);
        }
        if (node.nodeName === 'INDIKACIOK') {
          data.euindikaciok = Array.from(node.childNodes).map(row => {
            const rowObject = {};
            Array.from(row.childNodes).forEach(node => {
              const nodeValue = node.textContent;
              rowObject[node.nodeName] = isNaN(Number(nodeValue))
                ? nodeValue
                : Number(nodeValue);
            });
            return rowObject;
          });
        }
        if (node.nodeName === 'FELIRBNO') {
          data.bnohozzar = Array.from(node.childNodes).map(row => {
            return { BNO_ID: row.firstChild.textContent };
          });
        }
        if (node.nodeName === 'FELIRHAT') {
          data.eujoghozzar = Array.from(node.childNodes).map(row => {
            const rowObject = {};
            Array.from(row.childNodes).forEach(node => {
              const nodeValue = node.textContent;
              rowObject[node.nodeName] = isNaN(Number(nodeValue))
                ? nodeValue
                : Number(nodeValue);
            });
            return rowObject;
          });
        }
      });
      break;
    case 'INKVALT':
      break;
  }
  return data;
};
