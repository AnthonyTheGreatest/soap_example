import { DOMParser } from '@xmldom/xmldom';

export const parseResponse = responseText => {
    const xmlDoc = new DOMParser().parseFromString(responseText, 'text/xml');
    const elementText = xmlDoc.getElementsByTagName('ELNEVEZ')[0].textContent;
    return elementText;
};
