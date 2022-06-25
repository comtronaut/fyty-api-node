import { Controller, Get, NotAcceptableException, Query, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { Debug } from "src/common/debug.decorator";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guard/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get("login")
  async login(
    @Query("username") username: string,
    @Query("password") password: string
  ) {   
    return await this.authService.localLogin(username, password);
  }

  @Debug()
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getProfile(@Req() req: Request) {        
    if (!req.user && typeof req.user !== "string") {
      throw new NotAcceptableException();
    }    

    return req.user;
  }
}
