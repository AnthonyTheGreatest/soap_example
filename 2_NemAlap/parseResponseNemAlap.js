import { DOMParser } from '@xmldom/xmldom';

export const parseResponse = (responseText, { name, columns }) => {
  const xmlDoc = new DOMParser().parseFromString(responseText, 'text/xml');
  let data;
  // Returns an array of node name and node value as a number or string
  const myParser = node => {
    const nodeName = node.nodeName;
    const nodeContent = node.textContent;
    const nodeValue = isNaN(Number(nodeContent))
      ? nodeContent
      : Number(nodeContent);
    return [nodeName, nodeValue];
  };
  // const myParser = node => {
  //   if (node.nodeType !== 1) return [null, null]; // Skip text nodes (?)
  //   const nodeName = node.nodeName;
  //   const nodeContent = node.textContent;
  //   const nodeValue = isNaN(Number(nodeContent))
  //     ? nodeContent
  //     : Number(nodeContent);
  //   return [nodeName, nodeValue];
  // };
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
    case 'TAMALAP_KATEGTAM_EUHOZZAR':
      data = [[]];
      const tamogatadatElement = Array.from(
        xmlDoc.getElementsByTagName('OBJTAMOGAT')
      )[0];
      // TAMALAP:
      const tamalap = {};
      let tamalapId;
      Array.from(tamogatadatElement.childNodes).forEach(node => {
        if (node.nodeType !== 1) return; // Parse only element nodes
        const [name, value] = myParser(node);
        if (name === 'TAMOGATASOK') {
          return;
        }
        if (name === 'ID') {
          tamalapId = value;
        }
        tamalap[name] = value;
      });
      data[0].push(tamalap);
      // KATEGTAM:
      const kategtam = Array.from(
        xmlDoc.getElementsByTagName('OBJKATEGTAM')
      ).map(row => {
        const rowObject = {};
        Array.from(row.childNodes).forEach(node => {
          if (node.nodeType !== 1) return; // Parse only element nodes
          const [name, value] = myParser(node);
          rowObject[name] = value;
        });
        // Add TAMALAP_ID to each row
        rowObject['TAMALAP_ID'] = tamalapId;
        return rowObject;
      });
      data.push(kategtam);
      // EUHOZZAR:
      const euhozzar = [];
      Array.from(xmlDoc.getElementsByTagName('OBJKATEGTAM')).forEach(
        kategtam => {
          const euhozzarObj = {};
          euhozzarObj['KATEGTAM_ID'] = kategtam.firstChild.textContent;
          const offlabelNumber = Number(
            kategtam.getElementsByTagName('OFFLABEL')[0].textContent
          );
          // const offlabelElement = kategtam.querySelector('OFFLABEL');
          // const offlabelNumber = offlabelElement ? Number(offlabelElement.textContent) : null;
          const eupontazonArr = [];
          Array.from(
            kategtam.getElementsByTagName('EUPONTAZON')[0].childNodes
          ).forEach(node => {
            const innerNode = node.firstChild;
            if (!innerNode) return;
            if (node.nodeType !== 1) return; // Parse only element nodes
            const [, value] = myParser(innerNode);
            eupontazonArr.push(value);
          });
          if (!eupontazonArr.length) {
            euhozzarObj['EUPONTAZON'] = null;
            euhozzarObj['OFFLABEL'] = isNaN(offlabelNumber)
              ? null
              : offlabelNumber;
            euhozzar.push(euhozzarObj);
            return;
          }
          eupontazonArr.forEach(id => {
            euhozzarObj['EUPONT_ID'] = id;
            euhozzarObj['OFFLABEL'] = isNaN(offlabelNumber)
              ? null
              : offlabelNumber;
            euhozzar.push(euhozzarObj);
          });
        }
      );
      data.push(euhozzar);
      break;
    case 'EUPONTOK_EUINDIKACIOK_BNOHOZZAR_EUJOGHOZZAR':
      data = {};
      data.eupontok = {};
      const objeupontChildren = Arry.from(
        xmlDoc.getElementsByTagName('OBJEUPONT')[0].childNodes
      );
      objeupontChildren.forEach(node => {
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
