import { Injectable } from '@nestjs/common';
import { BussinessExcp } from 'src/domain/Exceptions/BussinessExcp';
import { OperationsValidationsRepository } from '../port/Validations/repository/operations-validations-repository';


@Injectable()
export class OperationsValidations implements OperationsValidationsRepository {

    public userHaveBalance = (balance: number, userBalance: number) => {
        const MAX_VALUE = 9000000;
        if ((balance + userBalance) > MAX_VALUE) {
            const allowedBalance = MAX_VALUE - userBalance;
            if (allowedBalance >= 0) {
                throw new BussinessExcp({ code: 'invalid_balance', allowedBalance: allowedBalance });
            }
        }
    };

    public addBalance = (balance: number, userBalance: number): number => {
        return (Number(balance) + Number(userBalance))
    };
}
