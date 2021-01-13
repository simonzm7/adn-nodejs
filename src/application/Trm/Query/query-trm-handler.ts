import { Injectable } from '@nestjs/common';
import { TrmRepository } from 'src/domain/Trm/port/TrmRepository';

@Injectable()
export class QueryTrmHandler{
    constructor(private readonly trmRepository : TrmRepository) {}
    public executeQuery =  async () => {
       return this.trmRepository.getTrmDollar();
    };
}

