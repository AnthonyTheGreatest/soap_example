import { latestUpdate, today } from '../latestUpdate';

export const data = {
  INKVALT_TERMEK_TAMOGATAS: {
    name: 'INKVALT_TERMEK_TAMOGATAS',
    SOAPAction: 'INKVALT',
    xmlData: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <pup:COBJIDLISTA-INKVALTInput>
                        <pup:DSP1-DATE-IN>${latestUpdate}</pup:DSP1-DATE-IN>
                        <pup:DSP2-DATE-IN>${today}</pup:DSP2-DATE-IN>
                        <pup:SXFILTER-VARCHAR2-IN>
                            <![CDATA[
                                <alapfilter>
                                </alapfilter>
                            ]]>
                        </pup:SXFILTER-VARCHAR2-IN>
                    </pup:COBJIDLISTA-INKVALTInput>
                    </soapenv:Body>
                </soapenv:Envelope>
                `, // Megadhatunk TERMKOD szűrőt G% (csak gyógyszer), S% (csak gyse) formában, hogy kb. a felére csökkentsük a rekordszámot.
    columns: [],
  },
  INKVALT_TABLA: {
    name: 'INKVALT_TABLA',
    SOAPAction: 'INKVALT',
    xmlData: table => `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pup="http://xmlns.oracle.com/orawsv/PUPHAX/PUPHAXWS">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <pup:COBJIDLISTA-INKVALTInput>
                        <pup:DSP1-DATE-IN>${latestUpdate}</pup:DSP1-DATE-IN>
                        <pup:DSP2-DATE-IN>${today}</pup:DSP2-DATE-IN>
                        <pup:SXFILTER-VARCHAR2-IN>
                            <![CDATA[
                                <alapfilter>
                                    <TABLANEV>${table}</TABLANEV>
                                </alapfilter>
                            ]]>
                        </pup:SXFILTER-VARCHAR2-IN>
                    </pup:COBJIDLISTA-INKVALTInput>
                    </soapenv:Body>
                </soapenv:Envelope>
                `,
    columns: [],
  },
};
