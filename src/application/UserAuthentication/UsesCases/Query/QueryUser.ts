import { Injectable } from "@nestjs/common";
import { QueryRepository } from "src/domain/UserActions/UserAuthentication/Repository/QueryRepository";



@Injectable()
export class QueryUser {
    constructor(private readonly queryRepositoy : QueryRepository){}

    async executeQuery(userId : string){
        await this.queryRepositoy.getUser(parseInt(userId));
    }
}