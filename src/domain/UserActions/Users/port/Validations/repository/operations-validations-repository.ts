
export abstract class OperationsValidationsRepository{
    public abstract userHaveBalance(balance: number, userBalance: number);
    public abstract addBalance(balance: number, userBalance: number) : number;
}