import {
  Controller,
  Get,
  HttpStatus,
  NotAcceptableException,
  Query,
  Req,
  UnauthorizedException,
  UseGuards
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { Debug } from "src/common/debug.decorator";
import { AuthService } from "./auth.service";
import { UserJwtAuthGuard } from "./guard/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("login")
  async login(
    @Query("username") username: string,
    @Query("password") password: string
  ) {
    return await this.authService.localLogin(username, password);
  }

  @Debug()
  @UseGuards(UserJwtAuthGuard)
  @Get("profile")
  async getProfile(@Req() req: Request) {
    if (!req.user && typeof req.user !== "string") {
      throw new NotAcceptableException();
    }

    return req.user;
  }

  @Get("/user/google")
  @UseGuards(AuthGuard("google"))
  async getUser(@Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    return await this.authService.retrieveUserAccessToken(req.user);
  }

  @Get("/user/facebook")
  @UseGuards(AuthGuard("facebook"))
  async facebookLoginRedirect(@Req() req: Request): Promise<any> {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    return await this.authService.retrieveUserAccessToken(req.user);
  }

  @Get("/google")
  @UseGuards(AuthGuard("google"))
  async googleLogin() {
    return HttpStatus.OK;
  }

  @Get("/facebook")
  @UseGuards(AuthGuard("facebook"))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }
}
