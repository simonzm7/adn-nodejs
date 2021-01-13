import { Controller, Get } from '@nestjs/common';
import { QueryTrmHandler } from 'src/application/Trm/Query/query-trm-handler';


@Controller('api/trm')
export class TrmController{

    constructor(private readonly trmQuery : QueryTrmHandler){}
    @Get()
    async getDollarTrm(){
        return await this.trmQuery.executeQuery();
    }
}
