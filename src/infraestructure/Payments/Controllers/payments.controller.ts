import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { QueryPaymentsUseCase } from "src/application/Payments/Query/QueryPaymentsUseCase";
import { AuthGuard } from "src/infraestructure/Appointments/adapters/Guard/AuthGuard";


@Controller('/api/payments')
@UseGuards(AuthGuard)
export class PaymentsController
{
    constructor(private readonly queryUseCase : QueryPaymentsUseCase) {}
    @Get()
    async getPayments(@Req() req){
        return await this.queryUseCase.executeQueryUserPayments(req.headers.userid);
    }
}