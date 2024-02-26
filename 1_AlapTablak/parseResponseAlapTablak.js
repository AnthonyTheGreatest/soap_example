import { DOMParser } from '@xmldom/xmldom';

export const parseResponse = (responseText, { columns }) => {
  const xmlDoc = new DOMParser().parseFromString(responseText, 'text/xml');
  const data = Array.from(xmlDoc.getElementsByTagName('OBJKODTABLA')).map(
    row => {
      const rowObject = {};
      Array.from(row.childNodes).forEach(node => {
        if (node.nodeName === 'KOD') {
          rowObject[columns[0]] = node.textContent;
        } else if (node.nodeName === 'ELNEVEZ') {
          rowObject[columns[1]] = node.textContent;
        } else if (node.nodeName === 'MEGJEGYZ') {
          rowObject[columns[2]] = node.textContent;
        }
      });
      return rowObject;
    }
  );
  return data;
};
