import { DOMParser } from '@xmldom/xmldom';

export const parseResponse = responseText => {
    const xmlDoc = new DOMParser().parseFromString(responseText, 'text/xml');
    // const elementText = xmlDoc.getElementsByTagName('ELNEVEZ')[0].textContent;
    const data = Array.from(xmlDoc.getElementsByTagName('OBJKODTABLA')).map(row => {
        const rowObject = {};
        Array.from(row.childNodes).forEach(node => { //row.children ?
            if (node.nodeName === 'KOD') {
                rowObject['ATC'] = node.textContent;
            } else if (node.nodeName === 'ELNEVEZ') {
                rowObject['HATOANYAG'] = node.textContent;
            } else if (node.nodeName === 'MEGJEGYZ') {
                rowObject['MEGNEV'] = node.textContent;
            }
        });
        return rowObject;
    });
    return data;
};
