import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

import { ResponseModel } from '@domain/common/response-model';
import { TrabajoModel } from "../trabajo.model";

@Injectable({
    providedIn: 'root'
})

export abstract class TrabajoGateway {

    abstract registrarTrabajo(trabajo: TrabajoModel): Observable<ResponseModel>

    abstract modificarTrabajo(trabajo: TrabajoModel): Observable<ResponseModel>

    abstract eliminarTrabajo(params: { id: number }): Observable<ResponseModel>

    abstract consultarTrabajo(params: { id: number }): Observable<ResponseModel<TrabajoModel>>

    abstract listaTrabajos(): Observable<ResponseModel<TrabajoModel[]>>

}
