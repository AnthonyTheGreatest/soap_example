import { DOMParser } from '@xmldom/xmldom';

export const parseResponse = (responseText, { columns }) => {
  const xmlDoc = new DOMParser().parseFromString(responseText, 'text/xml');
  const data = Array.from(xmlDoc.getElementsByTagName('OBJKIHIRDELEM')).map(row => {
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
  });
  return data;
};
