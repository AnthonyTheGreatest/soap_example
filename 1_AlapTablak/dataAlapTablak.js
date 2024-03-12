export const data = {
  ATCKONYV: {
    name: 'ATCKONYV',
    SOAPAction: 'TABATC',
    xmlData: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <pup:COBJALAP-TABATCInput>
                        <pup:SXFILTER-VARCHAR2-IN>
                            <![CDATA[
                                <alapfilter>
                                    <ATC>%</ATC>
                                </alapfilter>
                            ]]>
                        </pup:SXFILTER-VARCHAR2-IN>
                    </pup:COBJALAP-TABATCInput>
                    </soapenv:Body>
                </soapenv:Envelope>`,
    columns: ['ATC', 'HATOANYAG', 'MEGNEV'],
    xmlDataInkvalt: arg => `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <pup:COBJALAP-TABATCInput>
                        <pup:SXFILTER-VARCHAR2-IN>
                            <![CDATA[
                                <alapfilter>
                                    <ATC>${arg}</ATC>
                                </alapfilter>
                            ]]>
                        </pup:SXFILTER-VARCHAR2-IN>
                    </pup:COBJALAP-TABATCInput>
                    </soapenv:Body>
                </soapenv:Envelope>`,
  },
  ISOKONYV: {
    name: 'ISOKONYV',
    SOAPAction: 'TABISO',
    xmlData: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <pup:COBJALAP-TABISOInput>
                        <pup:SXFILTER-VARCHAR2-IN>
                            <![CDATA[
                                <alapfilter>
                                    <ISO>%</ISO>
                                </alapfilter>
                            ]]>
                        </pup:SXFILTER-VARCHAR2-IN>
                    </pup:COBJALAP-TABISOInput>
                    </soapenv:Body>
                </soapenv:Envelope>`,
    columns: ['ISO', 'MEGNEVEZES'], // 3. 'oszlop' üres
    xmlDataInkvalt: arg => `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <pup:COBJALAP-TABISOInput>
                        <pup:SXFILTER-VARCHAR2-IN>
                            <![CDATA[
                                <alapfilter>
                                    <ISO>${arg}</ISO>
                                </alapfilter>
                            ]]>
                        </pup:SXFILTER-VARCHAR2-IN>
                    </pup:COBJALAP-TABISOInput>
                    </soapenv:Body>
                </soapenv:Envelope>`,
  },
  BNOKODOK: {
    name: 'BNOKODOK',
    SOAPAction: 'TABBNO',
    xmlData2: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <pup:COBJALAP-TABBNOInput>
                        <pup:SXFILTER-VARCHAR2-IN>
                            <![CDATA[
                                <alapfilter>
                                    <BNO>%G</BNO>
                                </alapfilter>
                            ]]>
                        </pup:SXFILTER-VARCHAR2-IN>
                    </pup:COBJALAP-TABBNOInput>
                    </soapenv:Body>
                </soapenv:Envelope>`,
    // bno (KOD) can also end with a letter
    xmlData:
      numOrLetter => `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <pup:COBJALAP-TABBNOInput>
                        <pup:SXFILTER-VARCHAR2-IN>
                            <![CDATA[
                                <alapfilter>
                                    <BNO>%${numOrLetter}</BNO>
                                </alapfilter>
                            ]]>
                        </pup:SXFILTER-VARCHAR2-IN>
                    </pup:COBJALAP-TABBNOInput>
                    </soapenv:Body>
                </soapenv:Envelope>`,
    columns: ['ID', 'KOD', 'LEIRAS'],
    xmlDataInkvalt: arg => `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <pup:COBJALAP-TABBNOInput>
                        <pup:SXFILTER-VARCHAR2-IN>
                            <![CDATA[
                                <alapfilter>
                                    <BNO>${arg}</BNO>
                                </alapfilter>
                            ]]>
                        </pup:SXFILTER-VARCHAR2-IN>
                    </pup:COBJALAP-TABBNOInput>
                    </soapenv:Body>
                </soapenv:Envelope>`,
  },
  BRAND: {
    name: 'BRAND',
    SOAPAction: 'TABBRAND',
    xmlData: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <pup:COBJALAP-TABBRANDInput>
                        <pup:SXFILTER-VARCHAR2-IN>
                            <![CDATA[
                                <alapfilter>
                                    <BRAND>%</BRAND>
                                </alapfilter>
                            ]]>
                        </pup:SXFILTER-VARCHAR2-IN>
                    </pup:COBJALAP-TABBRANDInput>
                    </soapenv:Body>
                </soapenv:Envelope>`,
    columns: ['ID', 'NEV'], // 3. 'oszlop' üres
    xmlDataInkvalt: arg => `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <pup:COBJALAP-TABBRANDInput>
                        <pup:SXFILTER-VARCHAR2-IN>
                            <![CDATA[
                                <alapfilter>
                                    <BRAND>${arg}</BRAND>
                                </alapfilter>
                            ]]>
                        </pup:SXFILTER-VARCHAR2-IN>
                    </pup:COBJALAP-TABBRANDInput>
                    </soapenv:Body>
                </soapenv:Envelope>`,
  },
  CEGEK: {
    name: 'CEGEK',
    SOAPAction: 'TABCEGEK',
    xmlData: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <pup:COBJALAP-TABCEGEKInput>
                        <pup:SXFILTER-VARCHAR2-IN>
                            <![CDATA[
                                <alapfilter>
                                    <CEGNEV>%</CEGNEV>
                                </alapfilter>
                            ]]>
                        </pup:SXFILTER-VARCHAR2-IN>
                    </pup:COBJALAP-TABCEGEKInput>
                    </soapenv:Body>
                </soapenv:Envelope>`,
    columns: ['ID', 'NEV', 'ERV_KEZD', 'ERV_VEGE'], // 3.'oszlop': CEGEK.ERV_KEZD és CEGEK.ERV_VEGE oszlopokból képezett karakterlánc, amely a következő alakú: ’2009.03.21-2014.12.31’
    xmlDataInkvalt: arg => `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <pup:COBJALAP-TABCEGEKInput>
                        <pup:SXFILTER-VARCHAR2-IN>
                            <![CDATA[
                                <alapfilter>
                                    <CEGNEV>${arg}</CEGNEV>
                                </alapfilter>
                            ]]>
                        </pup:SXFILTER-VARCHAR2-IN>
                    </pup:COBJALAP-TABCEGEKInput>
                    </soapenv:Body>
                </soapenv:Envelope>`,
  },
  KIINTOR: {
    name: 'KIINTOR',
    SOAPAction: 'TABKIINTOR',
    xmlData: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <pup:COBJALAP-TABKIINTORInput>
                        <pup:SXFILTER-VARCHAR2-IN>
                            <![CDATA[
                                <alapfilter>
                                    <CEGNEV>%</CEGNEV>
                                </alapfilter>
                            ]]>
                        </pup:SXFILTER-VARCHAR2-IN>
                    </pup:COBJALAP-TABKIINTORInput>
                    </soapenv:Body>
                </soapenv:Envelope>`,
    columns: ['ID', 'INTEZET', 'EGYSEG', 'PECSETKOD'], // 2. 'oszlop': KIINTOR.INTEZET és KIINTOR.EGYSEG mező tartalma összefűzve egy | (pipe) karakterrel
    // No inkvalt data...
  },
  SZAKVKODOK: {
    name: 'SZAKVKODOK',
    SOAPAction: 'TABOSZAKKEP',
    xmlData: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <pup:COBJALAP-TABOSZAKKEPInput>
                        <pup:SXFILTER-VARCHAR2-IN>
                            <![CDATA[
                                <alapfilter>
                                    <SZKOD>%</SZKOD>
                                </alapfilter>
                            ]]>
                        </pup:SXFILTER-VARCHAR2-IN>
                    </pup:COBJALAP-TABOSZAKKEPInput>
                    </soapenv:Body>
                </soapenv:Envelope>`,
    columns: ['KOD', 'LEIRAS', 'MEGFELEL'], // 3. 'oszlop': milyen (korábbi) szakképesítésnek felel meg, a korábbi KOD-ot tartalmazza
    xmlDataInkvalt: arg => `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <pup:COBJALAP-TABOSZAKKEPInput>
                        <pup:SXFILTER-VARCHAR2-IN>
                            <![CDATA[
                                <alapfilter>
                                    <SZKOD>${arg}</SZKOD>
                                </alapfilter>
                            ]]>
                        </pup:SXFILTER-VARCHAR2-IN>
                    </pup:COBJALAP-TABOSZAKKEPInput>
                    </soapenv:Body>
                </soapenv:Envelope>`,
  },
  ORVOSOK: {
    name: 'ORVOSOK',
    SOAPAction: 'TABORVKEP',
    xmlData:
      num => `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <pup:COBJALAP-TABORVKEPInput>
                        <pup:SXFILTER-VARCHAR2-IN>
                            <![CDATA[
                                <alapfilter>
                                    <SZKOD>%${num}</SZKOD>
                                </alapfilter>
                            ]]>
                        </pup:SXFILTER-VARCHAR2-IN>
                    </pup:COBJALAP-TABORVKEPInput>
                    </soapenv:Body>
                </soapenv:Envelope>`,
    columns: ['orvosok.PECSETKOD', 'szakvkodok.KOD', 'szakvkodok.LEIRAS'], // ...
    xmlDataInkvalt: arg => `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <pup:COBJALAP-TABORVKEPInput>
                        <pup:SXFILTER-VARCHAR2-IN>
                            <![CDATA[
                                <alapfilter>
                                    <SZKOD>${arg}</SZKOD>
                                </alapfilter>
                            ]]>
                        </pup:SXFILTER-VARCHAR2-IN>
                    </pup:COBJALAP-TABORVKEPInput>
                    </soapenv:Body>
                </soapenv:Envelope>`,
  },
  NICHE: {
    name: 'NICHE',
    SOAPAction: 'TABNICHE',
    xmlData: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <pup:COBJALAP-TABNICHEInput>
                        <pup:SXFILTER-VARCHAR2-IN>
                            <![CDATA[
                                <alapfilter>
                                    <NICHENEV>%</NICHENEV>
                                </alapfilter>
                            ]]>
                        </pup:SXFILTER-VARCHAR2-IN>
                    </pup:COBJALAP-TABNICHEInput>
                    </soapenv:Body>
                </soapenv:Envelope>`,
    columns: ['ID', 'EGYEN_ID', 'LEIRAS'],
    // No inkvalt data...
  },
};
