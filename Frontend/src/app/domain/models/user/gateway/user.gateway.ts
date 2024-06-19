import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ResponseModel } from '@domain/common/response-model';
import { UserModel } from '@domain/models/user/user.model';

@Injectable({
    providedIn: 'root'
})

export abstract class UserGateway {

    abstract login(params: { usuario: string, contrasena: string }): Observable<ResponseModel>;

    //Postulante 
    abstract registrarPostulante(usuario: UserModel): Observable<ResponseModel>


    //Empleados
    abstract registrarEmpleado(usuario: UserModel): Observable<ResponseModel>

    abstract modificarEmpleado(usuario: UserModel): Observable<ResponseModel>

    abstract listaEmpleados(): Observable<ResponseModel<UserModel[]>>

    abstract consultarEmpleado(params: { id: number }): Observable<ResponseModel<UserModel>>

}
