import { Controller, Get, NotAcceptableException, Query, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guard/jwt-auth.guard";

@Controller("api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get("login")
  async login(
    @Query("username") username: string,
    @Query("password") password: string
  ) {   
    return await this.authService.localLogin(username, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getProfile(@Req() req: Request) {        
    if (!req.user && typeof req.user !== "string") {
      throw new NotAcceptableException();
    }    

    return req.user;
  }
}
