import { Observable, map } from "rxjs";
import { UserGateway } from "../../../../domain/models/user/gateway/user.gateway";
import { UserModel } from "../../../../domain/models/user/user.model";
import { HttpClient } from "@angular/common/http";
import { UserEntity } from "../entities/user.entity";
import { UserRepositoryMapper } from "../../../helpers/mappers/user/user-repository.mapper";

export class LocalUserImplementationRepository extends UserGateway {

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
