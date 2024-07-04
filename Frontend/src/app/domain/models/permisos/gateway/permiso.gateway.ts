// RxJS para manejo de Observables
import { Observable } from "rxjs";

// Injectable para la inyección de dependencias en Angular
import { Injectable } from "@angular/core";

// Modelos de dominio utilizados por el gateway
import { ResponseModel } from '@domain/common/response-model';
import { PermisoTipoModel } from '@domain/models/permisos/permiso-tipo.model';
import { PermisoSolicitudModel } from "@domain/models/permisos/permiso-solicitud.model";

/**
    * Interfaz abstracta que define las operaciones relacionadas con permisos.
    * Se utiliza como un gateway para comunicarse con el backend o almacenamiento de datos.
*/
@Injectable({
    providedIn: 'root'
})
export abstract class PermisoGateway {

    /**
        * Método abstracto para registrar un nuevo tipo de permiso.
        *
        * @param {string} params.tipo - Nombre o descripción del tipo de permiso a registrar.
        * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación.
    */
    abstract registrarTipoPermiso(params: { tipo: string }): Observable<ResponseModel>;

    /**
        * Método abstracto para obtener la lista de tipos de permisos disponibles.
        *
        * @returns {Observable<ResponseModel<PermisoTipoModel[]>>} Observable que emite una respuesta con la lista de tipos de permisos.
    */
    abstract listaTipoPermisos(): Observable<ResponseModel<PermisoTipoModel[]>>;

    /**
        * Método abstracto para registrar una nueva solicitud de permiso.
        *
        * @param {PermisoSolicitudModel} params - Objeto que representa la solicitud de permiso a registrar.
        * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación.
    */
    abstract registrarSolicitudPermiso(params: PermisoSolicitudModel): Observable<ResponseModel>;

    /**
        * Método abstracto para modificar una solicitud de permiso existente.
        *
        * @param {PermisoSolicitudModel} params - Objeto que representa la solicitud de permiso a modificar.
        * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación.
    */
    abstract modificarSolicitudPermiso(params: PermisoSolicitudModel): Observable<ResponseModel>;

    /**
        * Método abstracto para aceptar una solicitud de permiso.
        *
        * @param {number} params.id - Identificador único de la solicitud de permiso a aceptar.
        * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación.
    */
    abstract aceptarSolicitudPermiso(params: { id: number }): Observable<ResponseModel>;

    /**
        * Método abstracto para rechazar una solicitud de permiso.
        *
        * @param {number} params.id - Identificador único de la solicitud de permiso a rechazar.
        * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación.
    */
    abstract rechazarSolicitudPermiso(params: { id: number }): Observable<ResponseModel>;

    /**
        * Método abstracto para obtener la lista de todas las solicitudes de permiso.
        *
        * @returns {Observable<ResponseModel<PermisoSolicitudModel[]>>} Observable que emite una respuesta con la lista de todas las solicitudes de permiso.
    */
    abstract listaSolicitudes(): Observable<ResponseModel<PermisoSolicitudModel[]>>;

    /**
        * Método abstracto para obtener la lista de solicitudes de permiso por ID específico.
        *
        * @param {number} params.id - Identificador único de la solicitud de permiso a buscar.
        * @returns {Observable<ResponseModel<PermisoSolicitudModel[]>>} Observable que emite una respuesta con la lista de solicitudes de permiso encontradas.
    */
    abstract listaSolicitudesPorId(params: { id: number }): Observable<ResponseModel<PermisoSolicitudModel[]>>;

}
