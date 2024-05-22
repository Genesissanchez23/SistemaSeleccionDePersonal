import { Observable } from "rxjs";
import { UserModel } from "../user.model";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})  

export abstract class UserGateway {
    
    abstract login(params: {username: string, password: string}): Observable<UserModel>;

}
