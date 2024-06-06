import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ResponseModel } from '@domain/common/response-model';
import { UserModel } from '@domain/models/user/user.model';

@Injectable({
    providedIn: 'root'
})

export abstract class UserGateway {

    abstract login(params: { usuario: string, contrasena: string }): Observable<ResponseModel>;

    abstract registrarPostulante(usuario: UserModel): Observable<ResponseModel>

    abstract registrarEmpleado(usuario: UserModel): Observable<ResponseModel>
    
    abstract modificarEmpleado(usuario: UserModel): Observable<ResponseModel>

    abstract listaEmpleados(): Observable<ResponseModel<UserModel[]>>

}
