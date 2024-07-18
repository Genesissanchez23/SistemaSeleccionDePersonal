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
 * Caso de uso concreto para listar postulaciones por postulante.
 * Implementa la interfaz UseCase para definir la operación `perform`.
 */
@Injectable({
    providedIn: 'root'
})
export class PostulacionListaPorPostulanteUsecase implements UseCase<{id: number}, ResponseModel<PostulacionModel[]>> {

    /**
     * Constructor que inyecta la dependencia del gateway de postulaciones.
     *
     * @param {PostulacionGateway} _postulacionGateway - Gateway para manejar las operaciones de postulaciones.
     */
    constructor(private _postulacionGateway: PostulacionGateway) { }

    /**
     * Método `perform` implementado desde la interfaz UseCase.
     * Invoca el método `listaPorPostulante` del PostulacionGateway para obtener las postulaciones de un postulante específico.
     *
     * @param {number} params.id - Identificador único del postulante cuyas postulaciones se desean obtener.
     * @returns {Observable<ResponseModel<PostulacionModel>>} Observable que emite una respuesta con las postulaciones del postulante.
     */
    perform(params: { id: number; }): Observable<ResponseModel<PostulacionModel[]>> {
       return this._postulacionGateway.listaPorPostulante(params);
    }
}
