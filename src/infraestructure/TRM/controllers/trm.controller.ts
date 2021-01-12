import { Controller, Get } from "@nestjs/common";
import { TrmQueryUseCase } from "src/application/Trm/Query/TrmQueryUseCase";


@Controller('api/trm')
export class TrmController{

    constructor(private readonly trmQuery : TrmQueryUseCase){}
    @Get()
    async getDollarTrm(){
        return await this.trmQuery.executeQuery();
    }
}