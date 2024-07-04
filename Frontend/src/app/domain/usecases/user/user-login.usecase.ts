// RxJS para manejo de Observables
import { Observable } from 'rxjs';

// Injectable para la inyección de dependencias en Angular
import { Injectable } from '@angular/core';

// Importaciones de casos de uso y modelos de dominio
import { UseCase } from '@domain/common/use-case';
import { ResponseModel } from '@domain/common/response-model';
import { UserGateway } from '@domain/models/user/gateway/user.gateway';

/**
  * Caso de uso concreto para realizar el inicio de sesión de usuario.
  * Implementa la interfaz UseCase para definir la operación `perform`.
*/
@Injectable({
  providedIn: 'root'
})
export class UserLoginUsecase implements UseCase<{ usuario: string, contrasena: string }, ResponseModel> {

  constructor(private _userGateway: UserGateway) { }

  /**
    * Método `perform` implementado desde la interfaz UseCase.
    * Invoca el método `login` del UserGateway para iniciar sesión con las credenciales proporcionadas.
    *
    * @param {Object} params - Parámetros de entrada que incluyen `usuario` y `contrasena`.
    * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado del inicio de sesión.
  */
  perform(params: { usuario: string; contrasena: string; }): Observable<ResponseModel> {
    return this._userGateway.login(params);
  }

}
