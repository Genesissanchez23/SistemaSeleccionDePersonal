// RxJS para manejo de Observables
import { Observable } from "rxjs";

// Injectable para la inyección de dependencias en Angular
import { Injectable } from "@angular/core";

// Modelos de dominio utilizados por el gateway
import { ResponseModel } from '@domain/common/response-model';
import { UserModel } from '@domain/models/user/user.model';

/**
    * Interfaz abstracta que define las operaciones relacionadas con usuarios.
    * Se utiliza como un gateway para comunicarse con el backend o almacenamiento de datos.
*/
@Injectable({
    providedIn: 'root'
})
export abstract class UserGateway {

    /**
        * Método abstracto para realizar el inicio de sesión.
        *
        * @param {string} params.usuario - Nombre de usuario para iniciar sesión.
        * @param {string} params.contrasena - Contraseña del usuario para iniciar sesión.
        * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado del inicio de sesión.
    */
    abstract login(params: { usuario: string, contrasena: string }): Observable<ResponseModel>;

    /**
        * Método abstracto para registrar un nuevo usuario como postulante.
        *
        * @param {UserModel} usuario - Objeto que representa el usuario a registrar como postulante.
        * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado del registro.
    */
    abstract registrarPostulante(usuario: UserModel): Observable<ResponseModel>;

    /**
        * Método abstracto para registrar un nuevo usuario como empleado.
        *
        * @param {UserModel} usuario - Objeto que representa el usuario a registrar como empleado.
        * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado del registro.
    */
    abstract registrarEmpleado(usuario: UserModel): Observable<ResponseModel>;

    /**
        * Método abstracto para modificar los datos de un usuario empleado existente.
        *
        * @param {UserModel} usuario - Objeto que representa el usuario empleado a modificar.
        * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la modificación.
    */
    abstract modificarEmpleado(usuario: UserModel): Observable<ResponseModel>;

    /**
        * Método abstracto para obtener la lista de todos los empleados registrados.
        *
        * @returns {Observable<ResponseModel<UserModel[]>>} Observable que emite una respuesta con la lista de empleados.
    */
    abstract listaEmpleados(): Observable<ResponseModel<UserModel[]>>;

    /**
        * Método abstracto para consultar los datos de un empleado por su identificador único.
        *
        * @param {number} params.id - Identificador único del empleado a consultar.
        * @returns {Observable<ResponseModel<UserModel>>} Observable que emite una respuesta con los datos del empleado consultado.
    */
    abstract consultarEmpleado(params: { id: number }): Observable<ResponseModel<UserModel>>;

}
