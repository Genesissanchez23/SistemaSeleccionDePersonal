// RxJS para manejo de Observables
import { Observable } from "rxjs";

// Injectable para la inyección de dependencias en Angular
import { Injectable } from "@angular/core";

// Importaciones de casos de uso y modelos de dominio
import { UseCase } from "@domain/common/use-case";
import { ResponseModel } from "@domain/common/response-model";
import { PostulacionModel } from "@domain/models/postulacion/postulacion.model";
import { PostulacionGateway } from "@domain/models/postulacion/gateway/postulacion.gateway";

/**
 * Caso de uso concreto para listar todas las postulaciones.
 * Implementa la interfaz UseCase para definir la operación `perform`.
 */
@Injectable({
    providedIn: 'root'
})
export class PostulacionListaUsecase implements UseCase<void, ResponseModel<PostulacionModel[]>> {

    /**
     * Constructor que inyecta la dependencia del gateway de postulaciones.
     *
     * @param {PostulacionGateway} _postulacionGateway - Gateway para manejar las operaciones de postulaciones.
     */
    constructor(private _postulacionGateway: PostulacionGateway) { }

    /**
     * Método `perform` implementado desde la interfaz UseCase.
     * Invoca el método `lista` del PostulacionGateway para obtener la lista de todas las postulaciones.
     *
     * @returns {Observable<ResponseModel<PostulacionModel[]>>} Observable que emite una respuesta con la lista de todas las postulaciones.
     */
    perform(): Observable<ResponseModel<PostulacionModel[]>> {
        return this._postulacionGateway.lista();
    }
    
}
