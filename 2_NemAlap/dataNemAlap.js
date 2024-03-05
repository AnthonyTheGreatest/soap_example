import { latestUpdate } from '../latestUpdate.js';

export const data = {
  KIHIRDETES: {
    name: 'KIHIRDETES',
    SOAPAction: 'KIHIRD',
    // TODO: change date (?)
    xmlData: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <pup:COBJKIHIRD-KIHIRDInput>
                        <pup:DSTART-DATE-IN>2024-01-01</pup:DSTART-DATE-IN>
                    </pup:COBJKIHIRD-KIHIRDInput>
                    </soapenv:Body>
                </soapenv:Envelope>`,
    columns: ['ERV_DATUM', 'STATUS', 'MUNKAVER'], // date, char, int
  },
  TERMEK_ID_LIST: {
    // (termék id (pk) lista)
    // az azonosító szám előtt egy előjelet is tartalmazhat (+ vagy -)
    name: 'TERMEK_ID_LIST',
    SOAPAction: 'TERMEKLISTA',
    // TODO: change filter
    xmlData2: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                <soapenv:Header/>
                <soapenv:Body>
                <pup:COBJIDLISTA-TERMEKLISTAInput>
                    <pup:DSP-DATE-IN>${latestUpdate}</pup:DSP-DATE-IN>
                    <pup:SXFILTER-VARCHAR2-IN>
                        <![CDATA[
                          <alapfilter>
                            <TERMKOD>G%</TERMKOD>
                          </alapfilter>
                          ]]>
                      </pup:SXFILTER-VARCHAR2-IN>
                  </pup:COBJIDLISTA-TERMEKLISTAInput>
                  </soapenv:Body>
              </soapenv:Envelope>`,
    xmlData:
      num => `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                  <soapenv:Header/>
                  <soapenv:Body>
                  <pup:COBJIDLISTA-TERMEKLISTAInput>
                      <pup:DSP-DATE-IN>${latestUpdate}</pup:DSP-DATE-IN>
                      <pup:SXFILTER-VARCHAR2-IN>
                          <![CDATA[
                            <alapfilter>
                              <TTT>%${num}</TTT>
                            </alapfilter>
                            ]]>
                        </pup:SXFILTER-VARCHAR2-IN>
                    </pup:COBJIDLISTA-TERMEKLISTAInput>
                    </soapenv:Body>
                </soapenv:Envelope>`,
    columns: [],
  },
  TERMEK: {
    name: 'TERMEK',
    SOAPAction: 'TERMEKADAT',
    xmlData2: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                  <soapenv:Header/>
                  <soapenv:Body>
                    <pup:COBJTERMEKADAT-TERMEKADATInput>
                        <pup:NID-NUMBER-IN>60300994</pup:NID-NUMBER-IN>
                    </pup:COBJTERMEKADAT-TERMEKADATInput>
                  </soapenv:Body>
              </soapenv:Envelope>
              `,
    xmlData:
      id => `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                <soapenv:Header/>
                <soapenv:Body>
                  <pup:COBJTERMEKADAT-TERMEKADATInput>
                      <pup:NID-NUMBER-IN>${id}</pup:NID-NUMBER-IN>
                  </pup:COBJTERMEKADAT-TERMEKADATInput>
                </soapenv:Body>
            </soapenv:Envelope>
            `,
    columns: [
      'ID',
      'PARENT_ID',
      'ERV_KEZD',
      'ERV_VEGE',
      'TERMEKKOD',
      'KOZHID',
      'TTT',
      'TK',
      'TKTORLES',
      'TKTORLESDAT',
      'EANKOD',
      'BRAND_ID',
      'NEV',
      'KISZNEV',
      'ATC',
      'ISO',
      'HATOANYAG',
      'ADAGMOD',
      'GYFORMA',
      'RENDELHET',
      'EGYEN_ID',
      'HELYETTESITH',
      'POTENCIA',
      'OHATO_MENNY',
      'HATO_MENNY',
      'HATO_EGYS',
      'KISZ_MENNY',
      'KISZ_EGYS',
      'DDD_MENNY',
      'DDD_EGYS',
      'DDD_FAKTOR',
      'DOT',
      'ADAG_MENNY',
      'ADAG_EGYS',
      'EGYEDI',
      'OLDALISAG',
      'TOBBLGAR',
      'PATIKA',
      'DOBAZON',
      'KERESZTJELZES',
      'FORGENGT_ID',
      'FORGALMAZ_ID',
      'FORGALOMBAN',
    ],
  },
  TAMALAP_KATEGTAM_EUHOZZAR: {
    name: 'TAMALAP_KATEGTAM_EUHOZZAR',
    SOAPAction: 'TAMOGATADAT',
    xmlData2: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                <soapenv:Header/>
                <soapenv:Body>
                  <pup:COBJTAMOGAT-TAMOGATADATInput>
                      <pup:DSP-DATE-IN>2024-02-01</pup:DSP-DATE-IN>
                      <pup:NID-NUMBER-IN>60300994</pup:NID-NUMBER-IN>
                  </pup:COBJTAMOGAT-TAMOGATADATInput>
                </soapenv:Body>
            </soapenv:Envelope>
            `,
    xmlData:
      id => `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                <soapenv:Header/>
                <soapenv:Body>
                  <pup:COBJTAMOGAT-TAMOGATADATInput>
                      <pup:DSP-DATE-IN>${latestUpdate}</pup:DSP-DATE-IN>
                      <pup:NID-NUMBER-IN>${id}</pup:NID-NUMBER-IN>
                  </pup:COBJTAMOGAT-TAMOGATADATInput>
                </soapenv:Body>
            </soapenv:Envelope>
            `,
    columns: [
      // TAMALAP:
      [
        'ID',
        'TERMEK_ID',
        'ERV_KEZD',
        'ERV_VEGE',
        'TERMAR',
        'NKAR',
        'FAN',
        'FAB',
        'MAXFAB',
        'AFA',
        'NTK',
        'EGYSEGAR',
        'BESOROLAS',
        'PRAS_TERMEK',
        'NICHE_ID',
        'KEST_TERM',
        'KGYKERET',
        'KULONL100',
      ],
      // KATEGTAM:
      [
        'ID',
        'KATEGORIA',
        'TAMTECHN',
        'KGYIRHATO',
        'MIN_ELETKOR',
        'MAX_ELETKOR',
        'NEM',
        'TAMSZAZ',
        'FIX_ID',
        'REFNTK',
        'NTAM',
        'BTAM',
        'TERDIJ',
        'NTKTD',
        'MIHAID',
        'MIHACEL',
        'MIHASTAT',
        'KIHI',
        'FELME',
        'TAMALAP_ID', // added when parsing
      ],
      // EUHOZZAR:
      ['KATEGTAM_ID', 'EUPONT_ID', 'OFFLABEL'],
    ],
  },
  EUPONTOK_EUINDIKACIOK_BNOHOZZAR_EUJOGHOZZAR: {
    name: 'EUPONTOK_EUINDIKACIOK_BNOHOZZAR_EUJOGHOZZAR',
    SOAPAction: 'TAMOGATEUPONT',
    xmlData2: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                <soapenv:Header/>
                <soapenv:Body>
                <pup:COBJEUPONT-TAMOGATEUPONTInput>
                    <pup:NID-NUMBER-IN>99502</pup:NID-NUMBER-IN>
                </pup:COBJEUPONT-TAMOGATEUPONTInput>
                </soapenv:Body>
            </soapenv:Envelope>`,
    xmlData:
      id => `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                <soapenv:Header/>
                <soapenv:Body>
                <pup:COBJEUPONT-TAMOGATEUPONTInput>
                    <pup:NID-NUMBER-IN>${id}</pup:NID-NUMBER-IN>
                </pup:COBJEUPONT-TAMOGATEUPONTInput>
                </soapenv:Body>
            </soapenv:Envelope>`,
    columns: [
      // EUPONTOK:
      ['ID', 'PONTSZAM', 'PERJELZES', 'FELIRAS', 'MEGJEGYZES'],
      // EUINDIKACIOK:
      // + auto incremented id
      // EUPONT_ID added when parsing
      ['EUPONT_ID', 'NDX', 'LEIRAS'],
      // BNOHOZZAR:
      // EUPONT_ID added when parsing
      ['EUPONT_ID', 'BNO_ID'],
      // EUJOGHOZZAR:
      // + auto incremented id
      // EUPONT_ID added when parsing
      [
        'EUPONT_ID',
        'KATEGORIA_ID',
        'JOGOSULT_ID',
        'JIDOKORLAT',
        'SZAKV_ID',
        'KIINT_ID',
      ],
    ],
  },
  INKVALT: {
    name: 'INKVALT',
    SOAPAction: 'INKVALT',
  },
};
