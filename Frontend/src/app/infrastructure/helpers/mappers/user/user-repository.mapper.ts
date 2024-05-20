import { Mapper } from "../../../common/mapper";
import { UserModel } from "../../../../domain/models/user/user.model";
import { UserEntity } from "../../../repositories/user/entities/user.entity";

export class UserRepositoryMapper extends Mapper<UserEntity, UserModel> {

  override mapFrom(param: UserEntity): UserModel {
    return {
      id: param.id,
      firstName: param.firstName,
      lastName: param.lastName,
      username: param.username,
      password: param.password
    }
  }

  override mapTo(param: UserModel): UserEntity {
    return {
      id: param.id,
      firstName: param.firstName,
      lastName: param.lastName,
      username: param.username,
      password: param.password
    }
  }

}
