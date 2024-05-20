import { Observable } from "rxjs";
import { UserModel } from "../user.model";

export abstract class UserGateway {
    
    abstract login(params: {username: string, password: string}): Observable<UserModel>;

}
