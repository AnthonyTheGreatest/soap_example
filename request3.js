import DigestClient from "digest-fetch"

const client = new DigestClient('PUPHAX', 'puphax');

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

const url = 'https://puphax.neak.gov.hu/PUPHAXWS';

export const doRequest = async () => {
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

console.log(await doRequest());
