import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import env from "src/common/env.config";
import { User } from "src/model/sql-entity/user/user.entity";
import { Repository } from "typeorm";
// import validator from "validator";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userModel: Repository<User>,
  ) {}

  // async getUserByOAuth(user: Response.OAuthResult) {
  //   try {
  //     if (user.email) {
  //       const res = await this.getUserByUsername(user.email);
  
  //       return this.getAccessToken(res.username);
  //     }
  //   }
  //   catch (err) {}

  //   return {
  //     requiredRegister: true,
  //     user
  //   };
  // }

  // async getUserByUsername(username: User["username"]): Promise<User> {
  //   return await this.usersRepository.findOneOrFail({ where: { username }}); 
  // }

  // async getUserByEmail(email: User["email"]): Promise<User> {
  //   return await this.usersRepository.findOneOrFail({ where: { email }}); 
  // }

  async getUserById(id: User["id"]) {
    return await this.userModel.findOneOrFail({ where: { id }})
  }

  async localLogin(userName: string, password: string) {
    try {
      const user = await this.userModel.findOneByOrFail({ username: userName });
      await this.validateLogin(user, password);

      return this.getAccessToken(user.id);
    } catch(err) {
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
