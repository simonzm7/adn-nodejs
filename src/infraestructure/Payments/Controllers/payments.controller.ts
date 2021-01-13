import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { QueryPaymentsHandler } from 'src/application/Payments/Query/query-appointment-handler';
import { AuthGuard } from 'src/infraestructure/Configuration/Guard/AuthGuard';


@Controller('/api/payments')
@UseGuards(AuthGuard)
export class PaymentsController
{
    constructor(private readonly queryUseCase : QueryPaymentsHandler) {}
    @Get()
    async getPayments(@Req() req){
        return await this.queryUseCase.executeQueryUserPayments(req.headers.userid);
    }
}
