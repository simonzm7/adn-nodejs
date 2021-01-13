import { HttpStatus, INestApplication } from '@nestjs/common'
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { createSandbox, SinonStubbedInstance } from 'sinon';
import { TrmController } from 'src/infraestructure/TRM/controllers/trm.controller';
import { createStubObj } from 'test/util/createObjectStub';
import { TrmRepository } from 'src/domain/Trm/port/TrmRepository';
import { QueryTrmHandler } from 'src/application/Trm/Query/query-trm-handler';


const sinonSandbox = createSandbox();
describe('TRM Unit Tests', () => {

    let app: INestApplication;
    let trmQueryUseCase : SinonStubbedInstance<QueryTrmHandler>;
    let trmRepository : SinonStubbedInstance<TrmRepository>;
    beforeAll(async () => {
        trmQueryUseCase = createStubObj<QueryTrmHandler>(['executeQuery'], sinonSandbox);
        trmRepository = createStubObj<TrmRepository>(['getTrmDollar'], sinonSandbox);
        let moduleRef = await Test.createTestingModule({
            controllers: [TrmController],
            providers: [{provide: QueryTrmHandler, useValue: trmQueryUseCase},
            {provide: TrmRepository, useValue: trmRepository}]
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterEach(() => sinonSandbox.restore());
    afterAll(async () => await app.close());

    it('should get the trm value', async () => {

        await trmQueryUseCase.executeQuery.returns(Promise.resolve({message: { trmValue: 3478.32 }}));
        const response = await request(app.getHttpServer())
        .get('/api/trm')
        .expect(HttpStatus.OK)

        expect(response.body.message.trmValue).toEqual(3478.32)
        
    })
})