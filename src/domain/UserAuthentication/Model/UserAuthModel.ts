import LoginDTO from "../Repository/DTO/LoginDTO";

export default class UserAuthModel
{
    private credentials : LoginDTO;
    constructor(credentials : LoginDTO)   {
        this.credentials = credentials;
    }
    get getEmail(): string {
        return this.credentials.email;
    }
    get getPassword(): string {
        return this.credentials.password;
    }
}