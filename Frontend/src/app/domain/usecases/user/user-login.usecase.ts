import { Observable } from 'rxjs';
import { UseCase } from '../../common/use-case';
import { UserModel } from '../../models/user/user.model';
import { UserGateway } from '../../models/user/gateway/user.gateway';

export class UserLoginUsecase implements UseCase<{ username: string, password: string }, UserModel> {

  constructor(private _userGateway: UserGateway) { }

  perform(
    params: { username: string; password: string; }
  ): Observable<UserModel> {
    return this._userGateway.login(params)
  }

}
