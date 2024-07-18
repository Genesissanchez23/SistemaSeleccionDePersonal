// RxJS para manejo de Observables
import { Observable } from "rxjs";

// Injectable para la inyección de dependencias en Angular
import { Injectable } from "@angular/core";

// Importaciones de casos de uso y modelos de dominio
import { UseCase } from "@domain/common/use-case";
import { ResponseModel } from "@domain/common/response-model";
import { PostulacionGateway } from "@domain/models/postulacion/gateway/postulacion.gateway";

/**
 * Caso de uso concreto para registrar la fecha de entrevista de una postulación.
 * Implementa la interfaz UseCase para definir la operación `perform`.
 */
@Injectable({
    providedIn: 'root'
})
export class PostulacionRegistrarFechaEntrevistaUsecase implements UseCase<{id: number, fechaEntrevista: Date}, ResponseModel> {

    /**
     * Constructor que inyecta la dependencia del gateway de postulaciones.
     *
     * @param {PostulacionGateway} _postulacionGateway - Gateway para manejar las operaciones de postulaciones.
     */
    constructor(private _postulacionGateway: PostulacionGateway) { }

    /**
     * Método `perform` implementado desde la interfaz UseCase.
     * Invoca el método `registrarFechaEntrevista` del PostulacionGateway para registrar la fecha de entrevista de una postulación.
     *
     * @param {number} params.id - Identificador único de la postulación.
     * @param {Date} params.fechaEntrevista - Fecha y hora de la entrevista a registrar.
     * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación.
     */
    perform(params: { id: number; fechaEntrevista: Date; }): Observable<ResponseModel> {
        return this._postulacionGateway.registrarFechaEntrevista(params);
    }
}
