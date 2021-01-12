import { HttpStatus, INestApplication } from "@nestjs/common"
import * as request from 'supertest';
import { Test } from "@nestjs/testing";
import { createSandbox, SinonStubbedInstance } from "sinon";
import { TrmQueryUseCase } from "src/application/Trm/Query/TrmQueryUseCase";
import { TrmController } from "src/infraestructure/TRM/controllers/trm.controller";
import { createStubObj } from "test/util/createObjectStub";
import { TrmAdapter } from "src/infraestructure/TRM/adapters/TrmAdapter";
import { TrmRepository } from "src/domain/Trm/Repository/TrmRepository";


const sinonSandbox = createSandbox();
describe('TRM Unit Tests', () => {

    let app: INestApplication;
    let trmQueryUseCase : SinonStubbedInstance<TrmQueryUseCase>;
    let trmRepository : SinonStubbedInstance<TrmRepository>;
    beforeAll(async () => {
        trmQueryUseCase = createStubObj<TrmQueryUseCase>(['executeQuery'], sinonSandbox);
        trmRepository = createStubObj<TrmRepository>(['getTrmDollar'], sinonSandbox);
        let moduleRef = await Test.createTestingModule({
            controllers: [TrmController],
            providers: [{provide: TrmQueryUseCase, useValue: trmQueryUseCase},
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