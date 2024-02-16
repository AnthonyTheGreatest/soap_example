import { DOMParser } from '@xmldom/xmldom';

export const parseResponse = (responseText, { name, columns }) => {
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
          if (name === 'EUPONTAZON' || name === 'OFFLABEL') return;
          rowObject[name] = value;
        });
        // Add TAMALAP_ID to each row
        rowObject['TAMALAP_ID'] = tamalapId;
        return rowObject;
      });
      data.push(kategtam);
      // EUHOZZAR:
      const euhozzar = [];
      // EUPONT ID array put at end of data array (inputs for TAMOGATEUPONT method):
      const eupontArr = [];
      Array.from(xmlDoc.getElementsByTagName('OBJKATEGTAM')).forEach(
        kategtam => {
          const euhozzarObj = {};
          // KATEGTAM_ID:
          const kategtamId = Number(
            kategtam.getElementsByTagName('ID')[0].textContent
          );
          // EUPONT_ID_arr:
          const eupontazonArr = [];
          const eupontazonElementContainsData = Array.from(
            kategtam
              .getElementsByTagName('EUPONTAZON')[0]
              .getElementsByTagName('OBJSTRING256')
          ).length;
          if (eupontazonElementContainsData) {
            Array.from(
              kategtam
                .getElementsByTagName('EUPONTAZON')[0]
                .getElementsByTagName('OBJSTRING256')
            ).forEach(eupont => {
              const value = Number(
                eupont.getElementsByTagName('SZOVEG')[0].textContent
              );
              eupontazonArr.push(value);
              eupontArr.push(value);
            });
          }
          // OFFLABEL_arr:
          const offlabelArr = [];
          const offlabelElementContainsData = Array.from(
            kategtam
              .getElementsByTagName('EUPONTAZON')[0]
              .getElementsByTagName('OBJSTRING256')
          ).length;
          if (offlabelElementContainsData) {
            Array.from(
              kategtam
                .getElementsByTagName('OFFLABEL')[0]
                .getElementsByTagName('OBJSTRING256')
            ).forEach(offlabel => {
              const value = Number(
                offlabel.getElementsByTagName('SZOVEG')[0].textContent
              );
              offlabelArr.push(value);
            });
          }
          if (!offlabelArr.length) {
            if (!eupontazonArr.length) {
              euhozzarObj['KATEGTAM_ID'] = kategtamId;
              euhozzarObj['EUPONT_ID'] = 0;
              euhozzarObj['OFFLABEL'] = 0;
              euhozzar.push(euhozzarObj);
            } else {
              eupontazonArr.forEach(id => {
                euhozzarObj['KATEGTAM_ID'] = kategtamId;
                euhozzarObj['EUPONT_ID'] = id;
                euhozzarObj['OFFLABEL'] = 0;
                euhozzar.push(euhozzarObj);
              });
            }
          } else {
            const EupontazonWithoutOfflabelArr = eupontazonArr.filter(
              eupontazon => {
                return !offlabelArr.includes(eupontazon);
              }
            );
            offlabelArr.forEach(offlabel => {
              euhozzarObj['KATEGTAM_ID'] = kategtamId;
              euhozzarObj['EUPONT_ID'] = offlabel;
              euhozzarObj['OFFLABEL'] = 1;
              euhozzar.push(euhozzarObj);
            });
            EupontazonWithoutOfflabelArr.forEach(noOfflabel => {
              euhozzarObj['KATEGTAM_ID'] = kategtamId;
              euhozzarObj['EUPONT_ID'] = noOfflabel;
              euhozzarObj['OFFLABEL'] = 0;
              euhozzar.push(euhozzarObj);
            });
          }
        }
      );
      data.push(euhozzar);
      // EUPONT ID array at index 3 in data array (inputs for TAMOGATEUPONT method):
      data.push(eupontArr);
      break;
    case 'EUPONTOK_EUINDIKACIOK_BNOHOZZAR_EUJOGHOZZAR':
      data = [];
      const tamogateupontElement = Array.from(
        xmlDoc.getElementsByTagName('OBJEUPONT')
      )[0];
      let eupontId;
      const eupontok = {};
      Array.from(tamogateupontElement.childNodes).forEach(node => {
        if (node.nodeType !== 1) return; // Parse only element nodes
        const [name, value] = myParser(node);
        // EUPONTOK:
        if (
          name !== 'INDIKACIOK' &&
          name !== 'FELIRBNO' &&
          name !== 'FELIRHAT'
        ) {
          if (name === 'ID') {
            eupontId = value;
          }
          eupontok[name] = value;
        }
        // EUINDIKACIOK:
        if (name === 'INDIKACIOK') {
          const euindikaciok = Array.from(
            node.getElementsByTagName('OBJINDIKACIO')
          ).map(row => {
            const rowObject = {};
            rowObject['EUPONT_ID'] = eupontId;
            Array.from(row.childNodes).forEach(node => {
              if (node.nodeType !== 1) return; // Parse only element nodes
              const [name, value] = myParser(node);
              rowObject[name] = value;
            });
            return rowObject;
          });
          data.push(euindikaciok);
        }
        // BNOHOZZAR:
        if (name === 'FELIRBNO') {
          const bnohozzar = Array.from(
            node.getElementsByTagName('OBJSTRING256')
          ).map(row => {
            const bnoId = row.getElementsByTagName('SZOVEG')[0].textContent;
            return {
              EUPONT_ID: eupontId,
              BNO_ID: bnoId,
            };
          });
          data.push(bnohozzar);
        }
        // EUJOGHOZZAR:
        if (name === 'FELIRHAT') {
          const eujoghozzar = Array.from(
            node.getElementsByTagName('OBJFELIRHATOSAG')
          ).map(row => {
            const rowObject = {};
            rowObject['EUPONT_ID'] = eupontId;
            Array.from(row.childNodes).forEach(node => {
              if (node.nodeType !== 1) return; // Parse only element nodes
              const [name, value] = myParser(node);
              rowObject[name] = value;
            });
            return rowObject;
          });
          data.push(eujoghozzar);
        }
      });
      // Put eupontok at beginning of data array:
      data.unshift([eupontok]);
      break;
    case 'INKVALT':
      break;
  }
  return data;
};
