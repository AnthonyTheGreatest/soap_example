import { latestUpdate } from '../latestUpdate.js';

export const data = {
  KIHIRDETES: {
    name: 'KIHIRDETES',
    SOAPAction: 'KIHIRD',
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
    xmlData: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                <soapenv:Header/>
                <soapenv:Body>
                <pup:COBJIDLISTA-TERMEKLISTAInput>
                    <pup:DSP-DATE-IN>${latestUpdate}</pup:DSP-DATE-IN>
                    <pup:SXFILTER-VARCHAR2-IN>
                        <![CDATA[
                          <alapfilter>
                            <BRAND>XANAX</BRAND>
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
    xmlData: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                <soapenv:Header/>
                <soapenv:Body>
                  <pup:COBJTERMEKADAT-TERMEKADATInput>
                      <pup:NID-NUMBER-IN>14714225</pup:NID-NUMBER-IN>
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
  EUPONTOK: {
    name: 'EUPONTOK',
    SOAPAction: 'TAMOGATEUPONT',
    xmlData: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                <soapenv:Header/>
                <soapenv:Body>
                <pup:COBJEUPONT-TAMOGATEUPONTInput>
                    <pup:NID-NUMBER-IN>76255</pup:NID-NUMBER-IN>
                </pup:COBJEUPONT-TAMOGATEUPONTInput>
                </soapenv:Body>
            </soapenv:Envelope>`,
    columns: [],
  },
};
