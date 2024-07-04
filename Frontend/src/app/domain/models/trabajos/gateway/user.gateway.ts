// RxJS para manejo de Observables
import { Observable } from "rxjs";

// Injectable para la inyección de dependencias en Angular
import { Injectable } from "@angular/core";

// Modelos de dominio utilizados por el gateway
import { ResponseModel } from '@domain/common/response-model';
import { TrabajoModel } from "../trabajo.model";

/**
    * Interfaz abstracta que define las operaciones relacionadas con trabajos.
    * Se utiliza como un gateway para comunicarse con el backend o almacenamiento de datos.
*/
@Injectable({
    providedIn: 'root'
})
export abstract class TrabajoGateway {

    /**
        * Método abstracto para registrar un nuevo trabajo.
        *
        * @param {TrabajoModel} trabajo - Objeto que representa el trabajo a registrar.
        * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación.
    */
    abstract registrarTrabajo(trabajo: TrabajoModel): Observable<ResponseModel>;

    /**
        * Método abstracto para modificar un trabajo existente.
        *
        * @param {TrabajoModel} trabajo - Objeto que representa el trabajo a modificar.
        * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación.
    */
    abstract modificarTrabajo(trabajo: TrabajoModel): Observable<ResponseModel>;

    /**
        * Método abstracto para eliminar un trabajo por su identificador.
        *
        * @param {number} params.id - Identificador único del trabajo a eliminar.
        * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación.
    */
    abstract eliminarTrabajo(params: { id: number }): Observable<ResponseModel>;

    /**
        * Método abstracto para consultar un trabajo por su identificador.
        *
        * @param {number} params.id - Identificador único del trabajo a consultar.
        * @returns {Observable<ResponseModel<TrabajoModel>>} Observable que emite una respuesta con el trabajo consultado.
    */
    abstract consultarTrabajo(params: { id: number }): Observable<ResponseModel<TrabajoModel>>;

    /**
        * Método abstracto para obtener la lista de todos los trabajos.
        *
        * @returns {Observable<ResponseModel<TrabajoModel[]>>} Observable que emite una respuesta con la lista de todos los trabajos.
    */
    abstract listaTrabajos(): Observable<ResponseModel<TrabajoModel[]>>;

}
