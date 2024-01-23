import DigestClient from "digest-fetch"
import dotenv from 'dotenv';
dotenv.config();

const client = new DigestClient(process.env.SOAP_USERNAME, process.env.SOAP_PASSWORD);

const xmlData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
   <soapenv:Header/>
   <soapenv:Body>
      <pup:COBJALAP-TABATCInput>
          <pup:SXFILTER-VARCHAR2-IN>
            <![CDATA[
                <alapfilter>
                <ATC>N05BA%</ATC>
                <ATCNEV>loraze%</ATCNEV>
                </alapfilter>
            ]]>
          </pup:SXFILTER-VARCHAR2-IN>
      </pup:COBJALAP-TABATCInput>
   </soapenv:Body>
</soapenv:Envelope>`;

const xmlDatafULL = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
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
</soapenv:Envelope>`;

const url = 'https://puphax.neak.gov.hu/PUPHAXWS';

export const makeRequest = async () => {
    try {
        const response = await client.fetch(url, {
            method: 'POST',
            body: xmlData,
            headers: {
              'Accept-Encoding': 'gzip,deflate',
              'Content-Type': 'text/xml;charset=UTF-8',
              'SOAPAction': 'TABATC',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
  } catch (error) {
        console.log('Error making the request:', error);
  }
};

// console.log(await makeRequest());
