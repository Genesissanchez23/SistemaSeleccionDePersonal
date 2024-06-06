import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environment/environment';
import { TokenService } from '@infrastructure/common/token.service';

//Domain
import { UserModel } from '@domain/models/user/user.model';
import { ResponseModel } from '@domain/common/response-model';
import { UserGateway } from '@domain/models/user/gateway/user.gateway';

//Infrastructure
import { ResponseData, UserEntity } from '@infrastructure/repositories/user/entities/user.entity';
import { UserLoginMapper } from '@infrastructure/repositories/user/mappers/user-login.mapper';
import { UserInsertRepositoryMapper } from '@infrastructure/repositories/user/mappers/user-insert.mapper';
import { UserListaRepositoryMapper } from '@infrastructure/repositories/user/mappers/user-listar.mapper';

@Injectable({
  providedIn: 'root'
})
export class LocalUserRepositoryService extends UserGateway {

  private urlBase = environment.endpoint
  private loginEndpoint: string = 'login'
  private registrarPostulanteEndpoint: string = 'registrarPostulante'
  private registrarEmpleadoEndpoint: string = 'registrar'
  private modificarEmpleadoEndpoint: string = 'actualizarUsuario'
  private listaEmpleadosEndpoint: string = 'consultarTodosPorTipo?s_tipo=empleado'

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
          if (respuesta.status) this.tokenService.createToken(response.resultado as string)
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

  override listaEmpleados(): Observable<ResponseModel<UserModel[]>> {
    return this.http
      .get<ResponseData>(`${this.urlBase}${this.listaEmpleadosEndpoint}`)
      .pipe(
        map(response => this.userListaMapper.mapFrom(response))
      )
  }

}
