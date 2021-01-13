import axios from 'axios';
import { BussinessExcp } from 'src/domain/Exceptions/BussinessExcp';
import { MethodType } from 'src/domain/Trm/port/Enums/MethodType';

export interface IRequest {
    url: string;
    method: MethodType;
    headers: {};
    data: string;
    errorCode: string;

}
export class Requests {

    private static Singleton: Requests;


    public static Instance = () => {
        if (!Requests.Singleton) {
            Requests.Singleton = new Requests();
        }

        return Requests.Singleton;
    };

    public createRequest = async ({ url, method, headers, data, errorCode }: IRequest) => {
        return axios({
            method,
            url,
            headers,
            data
        })
            .then((resp) => resp.data)
            .catch(() => {
                throw new BussinessExcp({ code: errorCode });
            });
    };
}
