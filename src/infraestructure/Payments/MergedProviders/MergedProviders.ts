import { PaymentsDBRepository } from "src/domain/Payments/Repository/PaymentsDBRepository";
import { PaymentDBAdapter } from "../Adapters/PaymentDBAdapter";


export const PaymentsMerge = {
    provide: PaymentsDBRepository,
    useClass: PaymentDBAdapter
}