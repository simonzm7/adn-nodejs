import { Module } from "@nestjs/common";
import { TrmQueryUseCase } from "src/application/Trm/Query/TrmQueryUseCase";
import { TrmController } from "./controllers/trm.controller";
import { MergeTrmAdapter } from './MergedProviders/Providers'


@Module({
    controllers: [TrmController],
    providers: [TrmQueryUseCase,MergeTrmAdapter]
})
export class TrmModule {}