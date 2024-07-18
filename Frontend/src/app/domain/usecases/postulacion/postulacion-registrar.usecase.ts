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
 * Caso de uso concreto para registrar una nueva postulación.
 * Implementa la interfaz UseCase para definir la operación `perform`.
 */
@Injectable({
    providedIn: 'root'
})
export class PostulacionRegistrarUsecase implements UseCase<PostulacionModel, ResponseModel> {

    /**
     * Constructor que inyecta la dependencia del gateway de postulaciones.
     *
     * @param {PostulacionGateway} _postulacionGateway - Gateway para manejar las operaciones de postulaciones.
     */
    constructor(private _postulacionGateway: PostulacionGateway) { }

    /**
     * Método `perform` implementado desde la interfaz UseCase.
     * Invoca el método `registrar` del PostulacionGateway para registrar una nueva postulación.
     *
     * @param {PostulacionModel} params - Objeto que representa la postulación a registrar.
     * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación de registro.
     */
    perform(params: PostulacionModel): Observable<ResponseModel> {
        return this._postulacionGateway.registrar(params);
    }
}
