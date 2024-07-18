// RxJS para manejo de Observables
import { Observable } from "rxjs";

// Injectable para la inyección de dependencias en Angular
import { Injectable } from "@angular/core";

// Modelos de dominio utilizados por el gateway
import { ResponseModel } from '@domain/common/response-model';
import { PostulacionModel } from "../postulacion.model";

/**
    * Interfaz abstracta que define las operaciones relacionadas con postulaciones.
    * Se utiliza como un gateway para comunicarse con el backend o almacenamiento de datos.
*/
@Injectable({
    providedIn: 'root'
})
export abstract class PostulacionGateway {

    /**
        * Método abstracto para registrar una nueva postulación.
        *
        * @param {PostulacionModel} postulacion - Objeto que representa la postulación a registrar.
        * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación.
    */
    abstract registrar(postulacion: PostulacionModel): Observable<ResponseModel>;

    /**
        * Método abstracto para obtener la lista de todas las postulaciones.
        *
        * @returns {Observable<ResponseModel<PostulacionModel[]>>} Observable que emite una respuesta con la lista de todas las postulaciones.
    */
    abstract lista(): Observable<ResponseModel<PostulacionModel[]>>;

    /**
        * Método abstracto para obtener la lista de postulaciones por identificador del postulante.
        *
        * @param {number} params.id - Identificador único del postulante cuyas postulaciones se quieren obtener.
        * @returns {Observable<ResponseModel<PostulacionModel>>} Observable que emite una respuesta con las postulaciones del postulante.
    */
    abstract listaPorPostulante(params: { id: number }): Observable<ResponseModel<PostulacionModel[]>>;

    /**
        * Método abstracto para obtener la lista de postulaciones por identificador de plaza laboral.
     *
     * @param {number} params.id - Identificador único de la plaza laboral cuyas postulaciones se quieren obtener.
     * @returns {Observable<ResponseModel<PostulacionModel>>} Observable que emite una respuesta con las postulaciones del postulante.
    */
    abstract listaPorPlazaLaboral(params: { id: number }): Observable<ResponseModel<PostulacionModel[]>>;

    /**
        * Método abstracto para registrar la fecha de entrevista para una postulación.
        *
        * @param {number} params.id - Identificador único de la postulación a la que se asignará la fecha de entrevista.
        * @param {Date} params.fechaEntrevista - Fecha y hora de la entrevista a registrar.
        * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación.
        */ 
    abstract registrarFechaEntrevista(params: { id: number, fechaEntrevista: Date }): Observable<ResponseModel>;

    /**
        * Método abstracto para solicitar datos complementarios para una postulación.
        *
        * @param {number} params.id - Identificador único de la postulación para la cual se solicitan datos complementarios.
        * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación.
    */
    abstract solicitarDatosComplementarios(params: { id: number }): Observable<ResponseModel>;

    /**
        * Método abstracto para rechazar una postulación.
        *
        * @param {number} params.id - Identificador único de la postulación a rechazar.
        * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación.
    */
    abstract recharzarPostulacion(params: { id: number }): Observable<ResponseModel>;

    /**
        * Método abstracto para registrar un cuestionario de entrevista para una postulación.
        *
        * @param {number} params.idPostulacion - Identificador único de la postulación a la cual se le asignará el cuestionario.
        * @param {string} params.cuestionario - Cuestionario de entrevista en formato de cadena.
        * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación.
    */
    abstract registrarCuestionarioEntrevista(params: { idPostulacion: number, cuestionario: string }): Observable<ResponseModel>;

}
