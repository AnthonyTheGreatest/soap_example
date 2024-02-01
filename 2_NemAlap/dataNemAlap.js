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
    columns: ['ERV_DATUM', 'STATUS', 'MUNKAVER'] // date, char, int
  }
};
