import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import env from "src/common/env.config";
import { User } from "src/model/sql-entity/user/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userModel: Repository<User>) {}

  async getUserByOAuth(user: any) {
    try {
      const res = await this.userModel.findOneBy({ email: user.email });
      if (res !== null) {
        return this.getAccessToken(res.id);
      } else {
        return {
          requiredRegister: true,
          user
        };
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getUserByUsername(username: User["username"]): Promise<User> {
    return await this.userModel.findOneOrFail({ where: { username } });
  }

  async getUserByEmail(email: User["email"]): Promise<User> {
    return await this.userModel.findOneOrFail({ where: { email } });
  }

  async getUserById(id: User["id"]) {
    return await this.userModel.findOneOrFail({ where: { id } });
  }

  async localLogin(userName: string, password: string) {
    try {
      const user = await this.userModel.findOneByOrFail({ username: userName });
      await this.validateLogin(user, password);

      return this.getAccessToken(user.id);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  private async validateLogin(user: User, password: User["password"]) {
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    throw new BadRequestException("username or password is incorrect.");
  }

  private getAccessToken(id: User["id"]) {
    const payload = { sub: id };
    const accessToken = jwt.sign(payload, env.JWT_SECRET);

    return { accessToken };
  }
}
