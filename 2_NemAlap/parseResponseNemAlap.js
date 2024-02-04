import { DOMParser } from '@xmldom/xmldom';

export const parseResponse = (responseText, { name, columns }) => {
  const xmlDoc = new DOMParser().parseFromString(responseText, 'text/xml');
  let data;
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
  }
  return data;
};
