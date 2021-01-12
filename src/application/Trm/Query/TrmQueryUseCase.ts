import { Injectable } from "@nestjs/common";
import { TrmRepository } from "src/domain/Trm/Repository/TrmRepository";


@Injectable()
export class TrmQueryUseCase{
    constructor(private readonly trmRepository : TrmRepository) {}
    public executeQuery =  async () => {
       return await this.trmRepository.getTrmDollar();
    }
}