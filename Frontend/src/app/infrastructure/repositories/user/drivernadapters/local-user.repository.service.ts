// Importación de módulos y clases necesarias
import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Importación del entorno de configuración
import { environment } from '@environment/environment';

// Importación de modelos y clases del dominio
import { UserModel } from '@domain/models/user/user.model';
import { ResponseModel } from '@domain/common/response-model';
import { UserGateway } from '@domain/models/user/gateway/user.gateway';

// Importación de entidades y mapeadores de la infraestructura
import { TokenService } from '@infrastructure/common/token.service';
import { UserLoginMapper } from '@infrastructure/repositories/user/mappers/user-login.mapper';
import { ResponseData, UserEntity } from '@infrastructure/repositories/user/entities/user.entity';
import { UserInsertRepositoryMapper } from '@infrastructure/repositories/user/mappers/user-insert.mapper';
import { UserListaRepositoryMapper } from '@infrastructure/repositories/user/mappers/user-listar.mapper';

/**
  * Servicio que actúa como repositorio local para la gestión de usuarios.
  * Implementa la interfaz UserGateway para definir métodos de gestión de usuarios.
*/
@Injectable({
  providedIn: 'root'
})
export class LocalUserRepositoryService extends UserGateway {

  // URL base para las peticiones HTTP
  private urlBase = environment.endpoint

  // Endpoints específicos para cada tipo de solicitud de permiso
  private loginEndpoint: string = 'login'
  private registrarPostulanteEndpoint: string = 'registrarPostulante'
  private registrarEmpleadoEndpoint: string = 'registrar'
  private modificarEmpleadoEndpoint: string = 'actualizarUsuario'
  private consultarEmpleadoEndpoint: string = 'consultarPorId?s_usuario_id='
  private listaEmpleadosEndpoint: string = 'consultarTodosPorTipo?s_tipo=empleado'

  // Instancias de los mappers necesarios para la conversión entre entidades y modelos
  private loginMapper = new UserLoginMapper();
  private userInsertMapper = new UserInsertRepositoryMapper()
  private userListaMapper = new UserListaRepositoryMapper()

  /**
    * Constructor del servicio.
    *
    * @param {HttpClient} http - Cliente HTTP para realizar peticiones.
    * @param {TokenService} tokenService - Servicio para gestionar tokens.
  */
  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { super() }

  /**
    * Inicia sesión de un usuario.
    *
    * @param {Object} params - Parámetros de la solicitud de inicio de sesión.
    * @param {string} params.usuario - Nombre de usuario.
    * @param {string} params.contrasena - Contraseña del usuario.
    * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado del inicio de sesión.
  */
  override login(
    params: { usuario: string; contrasena: string; }
  ): Observable<ResponseModel> {
    const requestBody: UserEntity = this.loginMapper.mapTo(params);
    return this.http
      .post<ResponseData>(`${this.urlBase}${this.loginEndpoint}`, requestBody)
      .pipe(
        map((response) => {
          const respuesta = this.loginMapper.mapFrom(response)
          if (respuesta.status) this.tokenService.createToken(respuesta.body as string)
          return respuesta
        })
      )
  }

  /**
    * Registra un nuevo postulante en el sistema.
    *
    * @param {UserModel} usuario - Datos del usuario a registrar.
    * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado del registro.
  */
  override registrarPostulante(
    usuario: UserModel
  ): Observable<ResponseModel> {
    const requestBody: UserEntity = this.userInsertMapper.mapTo(usuario);
    return this.http
      .post<ResponseData>(`${this.urlBase}${this.registrarPostulanteEndpoint}`, requestBody)
      .pipe(
        map(response => this.userInsertMapper.mapFrom(response))
      )
  }

  /**
    * Registra un nuevo empleado en el sistema.
    *
    * @param {UserModel} usuario - Datos del usuario a registrar.
    * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado del registro.
  */
  override registrarEmpleado(
    usuario: UserModel
  ): Observable<ResponseModel> {
    const requestBody: UserEntity = this.userInsertMapper.mapTo(usuario);
    return this.http
      .post<ResponseData>(`${this.urlBase}${this.registrarEmpleadoEndpoint}`, requestBody)
      .pipe(
        map(response => this.userInsertMapper.mapFrom(response))
      )
  }

  /**
    * Modifica un empleado existente en el sistema.
    *
    * @param {UserModel} usuario - Datos del usuario a modificar.
    * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la modificación.
  */
  override modificarEmpleado(
    usuario: UserModel
  ): Observable<ResponseModel> {
    const requestBody: UserEntity = this.userInsertMapper.mapTo(usuario);
    return this.http
      .put<ResponseData>(`${this.urlBase}${this.modificarEmpleadoEndpoint}`, requestBody)
      .pipe(
        map(response => this.userInsertMapper.mapFrom(response))
      )
  }

  /**
    * Consulta los detalles de un empleado específico por su identificador.
    *
    * @param {Object} params - Parámetros de la solicitud de consulta del empleado.
    * @param {number} params.id - Identificador único del empleado a consultar.
    * @returns {Observable<ResponseModel<UserModel>>} Observable que emite una respuesta con los detalles del empleado.
  */
  override consultarEmpleado(
    params: { id: number; }
  ): Observable<ResponseModel<UserModel>> {
    return this.http
      .get<ResponseData>(`${this.urlBase}${this.consultarEmpleadoEndpoint}${params.id}`)
      .pipe(
        map(response => ({
          status: response.mensaje,
          body: this.userListaMapper.mapToUserModel(response.resultado as UserEntity)
        }))
      )
  }

  /**
    * Obtiene la lista de todos los empleados registrados en el sistema.
    *
    * @returns {Observable<ResponseModel<UserModel[]>>} Observable que emite una respuesta con la lista de empleados.
  */
  override listaEmpleados(): Observable<ResponseModel<UserModel[]>> {
    return this.http
      .get<ResponseData>(`${this.urlBase}${this.listaEmpleadosEndpoint}`)
      .pipe(
        map(response => this.userListaMapper.mapFrom(response))
      )
  }

}
