import { HttpStatus, INestApplication } from '@nestjs/common'
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { createSandbox, SinonStubbedInstance } from 'sinon';
import { PaymentsController } from 'src/infraestructure/Payments/Controllers/payments.controller';
import { createStubObj } from 'test/util/createObjectStub';
import { QueryPaymentsHandler } from 'src/application/Payments/Query/query-appointment-handler';


const sinonSandbox = createSandbox();
describe('Payments Unit Tests', () => {

    let app: INestApplication;
    let queryPaymentsUseCase : SinonStubbedInstance<QueryPaymentsHandler>;
    beforeAll(async () => {
        queryPaymentsUseCase = createStubObj<QueryPaymentsHandler>(['executeQueryUserPayments'], sinonSandbox);
        let moduleRef = await Test.createTestingModule({
            controllers: [PaymentsController],
            providers: [{provide: QueryPaymentsHandler, useValue: queryPaymentsUseCase}]
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterEach(() => sinonSandbox.restore());
    afterAll(async () => await app.close());


    it('should get payments', async ()=> {
        const paymentsList : {}[] = [{ date: '31/12/2021', value: 1000000, paymentCode: 'payment_type' }];
       
        queryPaymentsUseCase.executeQueryUserPayments.returns(Promise.resolve(paymentsList));
        const response = await request(app.getHttpServer())
        .get('/api/payments')
        .set({userid: 1})
        .expect(HttpStatus.OK);

        expect(response.body).toEqual(paymentsList);
    })
})