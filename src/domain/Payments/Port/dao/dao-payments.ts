export abstract class DaoPayments{
    public abstract getPayments(idUser : number) : Promise<{}[]>;
}
