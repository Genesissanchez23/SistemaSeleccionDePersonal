// RxJS para manejo de Observables
import { Observable } from "rxjs";

// Injectable para la inyección de dependencias en Angular
import { Injectable } from "@angular/core";

// Importaciones de casos de uso y modelos de dominio
import { UseCase } from "@domain/common/use-case";
import { ResponseModel } from "@domain/common/response-model";
import { PostulacionGateway } from "@domain/models/postulacion/gateway/postulacion.gateway";

/**
    * Caso de uso concreto para registrar un cuestionario de entrevista para una postulación.
    * Implementa la interfaz UseCase para definir la operación `perform`.
*/
@Injectable({
    providedIn: 'root'
})
export class PostulacionRegistrarCuestioanrioEntrevistaUseCase implements UseCase<{ idPostulacion: number, cuestionario: string }, ResponseModel> {

    /**
        * Constructor que inyecta la dependencia del gateway de postulaciones.
        *
        * @param {PostulacionGateway} _postulacionGateway - Gateway para manejar las operaciones de postulaciones.
    */
    constructor(private _postulacionGateway: PostulacionGateway) { }

    /**
        * Método `perform` implementado desde la interfaz UseCase.
        * Invoca el método `registrarCuestionarioEntrevista` del PostulacionGateway para registrar un cuestionario de entrevista para una postulación específica.
        *
        * @param {number} params.idPostulacion - Identificador único de la postulación a la cual se le asignará el cuestionario.
        * @param {string} params.cuestionario - Cuestionario de entrevista en formato de cadena.
        * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación.
    */
    perform(params: { idPostulacion: number, cuestionario: string }): Observable<ResponseModel> {
        return this._postulacionGateway.registrarCuestionarioEntrevista(params);
    }
    
}
