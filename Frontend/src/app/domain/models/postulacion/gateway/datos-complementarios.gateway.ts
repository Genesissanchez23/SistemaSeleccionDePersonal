// RxJS para manejo de Observables
import { Observable } from "rxjs";

// Injectable para la inyección de dependencias en Angular
import { Injectable } from "@angular/core";

// Modelos de dominio utilizados por el gateway
import { ResponseModel } from '@domain/common/response-model';
import { DatosComplementariosModel } from "../datos-complementarios.model";

/**
    * Interfaz abstracta que define las operaciones relacionadas con datos complementarios.
    * Se utiliza como un gateway para comunicarse con el backend o almacenamiento de datos.
*/
@Injectable({
    providedIn: 'root'
})
export abstract class DatosComplementariosGateway {

    /**
        * Método abstracto para registrar nuevos datos complementarios.
        *
        * @param {DatosComplementariosModel} datos - Objeto que representa los datos complementarios a registrar.
        * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación.
    */
    abstract registrar(datos: DatosComplementariosModel): Observable<ResponseModel>;

    /**
        * Método abstracto para consultar datos complementarios por ID de postulación.
        *
        * @param {number} params.id - Identificador único de la postulación cuyos datos complementarios se quieren obtener.
        * @returns {Observable<ResponseModel<DatosComplementariosModel>>} Observable que emite una respuesta con los datos complementarios.
    */
    abstract consultarPorPostulacionId(params: { id: number}): Observable<ResponseModel<DatosComplementariosModel>>;

}
