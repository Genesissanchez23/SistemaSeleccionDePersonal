import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ResponseModel } from '@domain/common/response-model';
import { PermisoTipoModel } from '@domain/models/permisos/permiso-tipo.model';
import { PermisoSolicitudModel } from "@domain/models/permisos/permiso-solicitud.model";

@Injectable({
    providedIn: 'root'
})

export abstract class PermisoGateway {

    //Tipos
    abstract registrarTipoPermiso(params: { tipo: string }): Observable<ResponseModel>;

    abstract listaTipoPermisos(): Observable<ResponseModel<PermisoTipoModel[]>>

    //Solicitud
    abstract registrarSolicitudPermiso(params: PermisoSolicitudModel): Observable<ResponseModel>;

    abstract modificarSolicitudPermiso(params: PermisoSolicitudModel): Observable<ResponseModel>;

    abstract aceptarSolicitudPermiso(params: { id: number }): Observable<ResponseModel>;

    abstract rechazarSolicitudPermiso(params: { id: number }): Observable<ResponseModel>;

    abstract listaSolicitudes(): Observable<ResponseModel<PermisoSolicitudModel[]>>

    abstract listaSolicitudesPorId(params: { id: number }): Observable<ResponseModel<PermisoSolicitudModel[]>>

}
