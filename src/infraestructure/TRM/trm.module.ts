import { Module } from '@nestjs/common';
import { QueryTrmHandler } from 'src/application/Trm/Query/query-trm-handler';
import { TrmController } from './controllers/trm.controller';
import { MergeTrmAdapter } from './providers/dao/dao-trm.provider'


@Module({
    controllers: [TrmController],
    providers: [QueryTrmHandler,MergeTrmAdapter]
})
export class TrmModule {}