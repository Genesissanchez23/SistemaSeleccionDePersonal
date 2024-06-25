import { Observable, map } from 'rxjs';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environment/environment';

import { UserModel } from '@domain/models/user/user.model';
import { ResponseModel } from '@domain/common/response-model';
import { UserGateway } from '@domain/models/user/gateway/user.gateway';

import { TokenService } from '@infrastructure/common/token.service';
import { UserLoginMapper } from '@infrastructure/repositories/user/mappers/user-login.mapper';
import { ResponseData, UserEntity } from '@infrastructure/repositories/user/entities/user.entity';
import { UserInsertRepositoryMapper } from '@infrastructure/repositories/user/mappers/user-insert.mapper';
import { UserListaRepositoryMapper } from '@infrastructure/repositories/user/mappers/user-listar.mapper';

@Injectable({
  providedIn: 'root'
})
export class LocalUserRepositoryService extends UserGateway {

  // URL base para los endpoints de la API Local
  private urlBase = environment.endpoint

  // Endpoint para login
  private loginEndpoint: string = 'login'

  // Endpoints para Postulante
  private registrarPostulanteEndpoint: string = 'registrarPostulante'

  // Endpoints para Empleado
  private registrarEmpleadoEndpoint: string = 'registrar'
  private modificarEmpleadoEndpoint: string = 'actualizarUsuario'
  private consultarEmpleadoEndpoint: string = 'consultarPorId?s_usuario_id='
  private listaEmpleadosEndpoint: string = 'consultarTodosPorTipo?s_tipo=empleado'

  // Mappers
  private loginMapper = new UserLoginMapper();
  private userInsertMapper = new UserInsertRepositoryMapper()
  private userListaMapper = new UserListaRepositoryMapper()

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { super() }

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

  override registrarPostulante(
    usuario: UserModel
  ): Observable<ResponseModel> {
    const requestBody: UserEntity = this.userInsertMapper.mapTo(usuario);
    return this.http
      .post<ResponseData>(`${this.urlBase}${this.registrarPostulanteEndpoint}`, requestBody)
      .pipe(
        map(response => {
          const respuesta = this.userInsertMapper.mapFrom(response)
          return respuesta
        })
      )
  }

  override registrarEmpleado(
    usuario: UserModel
  ): Observable<ResponseModel> {
    const requestBody: UserEntity = this.userInsertMapper.mapTo(usuario);
    return this.http
      .post<ResponseData>(`${this.urlBase}${this.registrarEmpleadoEndpoint}`, requestBody)
      .pipe(
        map(response => {
          const respuesta = this.userInsertMapper.mapFrom(response)
          return respuesta
        })
      )
  }

  override modificarEmpleado(
    usuario: UserModel
  ): Observable<ResponseModel> {
    const requestBody: UserEntity = this.userInsertMapper.mapTo(usuario);
    return this.http
      .put<ResponseData>(`${this.urlBase}${this.modificarEmpleadoEndpoint}`, requestBody)
      .pipe(
        map(response => {
          const respuesta = this.userInsertMapper.mapFrom(response)
          return respuesta
        })
      )
  }

  override consultarEmpleado(
    params: { id: number; }
  ): Observable<ResponseModel<UserModel>> {
    return this.http
      .get<ResponseData>(`${this.urlBase}${this.consultarEmpleadoEndpoint}${params.id}`)
      .pipe(
        map(response => {
          return {
            status: response.mensaje,
            body: this.userListaMapper.mapToUserModel(response.resultado as UserEntity)
          }
        })
      )
  }

  override listaEmpleados(): Observable<ResponseModel<UserModel[]>> {
    return this.http
      .get<ResponseData>(`${this.urlBase}${this.listaEmpleadosEndpoint}`)
      .pipe(
        map(response => this.userListaMapper.mapFrom(response))
      )
  }

}
