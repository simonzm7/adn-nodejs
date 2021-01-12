import { TrmRepository } from "src/domain/Trm/Repository/TrmRepository";
import { TrmAdapter } from "../adapters/TrmAdapter";


export const MergeTrmAdapter = {
    provide: TrmRepository,
    useClass: TrmAdapter
}