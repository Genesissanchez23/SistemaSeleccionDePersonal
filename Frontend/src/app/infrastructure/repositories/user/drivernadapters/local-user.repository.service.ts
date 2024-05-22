import { Injectable } from '@angular/core';
import { UserGateway } from '../../../../domain/models/user/gateway/user.gateway';
import { UserRepositoryMapper } from '../../../helpers/mappers/user/user-repository.mapper';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../../../../domain/models/user/user.model';
import { Observable, map } from 'rxjs';
import { UserEntity } from '../entities/user.entity';

@Injectable({
  providedIn: 'root'
})
export class LocalUserRepositoryService extends UserGateway {

  private userMapper = new UserRepositoryMapper();

  constructor(private http: HttpClient) { super() }
  
  override login(
    params: { username: string; password: string; }
  ): Observable<UserModel> {
    return this.http
      .post<UserEntity>('', params)
      .pipe(map(this.userMapper.mapFrom))
  }

}
