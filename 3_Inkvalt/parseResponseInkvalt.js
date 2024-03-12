import { DOMParser } from '@xmldom/xmldom';

export const parseResponse = (responseText, { name }) => {
  const xmlDoc = new DOMParser().parseFromString(responseText, 'text/xml');
  let data;
  // Returns an array of node name, and node value as a number or string
  const myParser = node => {
    const nodeName = node.nodeName;
    const nodeContent = node.textContent;
    const nodeValue = isNaN(Number(nodeContent))
      ? nodeContent
      : Number(nodeContent);
    return [nodeName, nodeValue];
  };
  switch (name) {
    case 'INKVALT_TABLA':
      data = Array.from(xmlDoc.getElementsByTagName('SZOVEG')).map(element => {
        if (element.textContent !== '999999999.999999') {
          return element.textContent;
        }
      });
      break;
    case 'INKVALT_TERMEK_IDS':
      data = Array.from(xmlDoc.getElementsByTagName('SZOVEG')).map(element => {
        if (element.textContent !== '999999999.999999') {
          return element.textContent;
        }
      });
      break;
  }
  return data;
};
