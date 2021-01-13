import { TrmRepository } from 'src/domain/Trm/port/TrmRepository';
import { TrmAdapter } from '../../adapters/TrmAdapter';


export const MergeTrmAdapter = {
    provide: TrmRepository,
    useClass: TrmAdapter
}