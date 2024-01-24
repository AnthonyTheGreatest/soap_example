// TODO: Finish data obj.

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
        columns: ['ATC', 'HATOANYAG', 'MEGNEV']
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
        columns: ['ISO', 'MEGNEVEZES'] // 3. 'oszlop' üres
    },
    BNOKODOK: {
        name: 'BNOKODOK',
        SOAPAction: 'TABBNO',
        xmlData: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <pup:COBJALAP-TABBNOInput>
                        <pup:SXFILTER-VARCHAR2-IN>
                            <![CDATA[
                                <alapfilter>
                                    <BNO>%</BNO>
                                </alapfilter>
                            ]]>
                        </pup:SXFILTER-VARCHAR2-IN>
                    </pup:COBJALAP-TABBNOInput>
                    </soapenv:Body>
                </soapenv:Envelope>`,
        columns: ['ID', 'KOD', 'LEIRAS']
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
        columns: ['ID', 'NEV'] // 3. 'oszlop' üres
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
        columns: ['ID', 'NEV', 'ERV_KEZD_PLUS_ERV_VEGE'] // 3.'oszlop': CEGEK.ERV_KEZD és CEGEK.ERV_VEGE oszlopokból képezett karakterlánc, amely a következő alakú: ’2009.03.21-2014.12.31’
    }
};