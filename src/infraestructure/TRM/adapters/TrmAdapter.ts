import { Injectable } from '@nestjs/common';
import { MethodType } from 'src/domain/Trm/port/Enums/MethodType';
import { TrmRepository } from 'src/domain/Trm/port/TrmRepository';
import { Requests } from './Handlers/Requests';
import { Xml } from './Handlers/Xml';

@Injectable()
export class TrmAdapter implements TrmRepository {

    private readonly xmls : string = "<s11:Envelope xmlns:s11='http://schemas.xmlsoap.org/soap/envelope/'>\r\n<s11:Body>\r\n<ns1:queryTCRM xmlns:ns1='http://action.trm.services.generic.action.superfinanciera.nexura.sc.com.co/'>\r\n<tcrmQueryAssociatedDate></tcrmQueryAssociatedDate>\r\n</ns1:queryTCRM>\r\n</s11:Body>\r\n</s11:Envelope>";
    private readonly path: string = 'https://www.superfinanciera.gov.co/SuperfinancieraWebServiceTRM/TCRMServicesWebService/TCRMServicesWebService?WSDL';
    getTrmDollar = async (): Promise<{}> => {
        const resXml : string = await Requests.Instance().createRequest({
            url: this.path,
            method: MethodType.POST,
            headers: {
                'SOAPAction': '',
                'Content-Type': 'text/xml'
            },
            data: this.xmls,
            errorCode: 'fetch_trm_error'
        });
        const value: string = await Xml.Instance().deserializeXml({ xml: resXml });
        return Promise.resolve({message: { trmValue: value }});
    }
}