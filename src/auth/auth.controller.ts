import { Controller, Get, Query, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { AuthService } from "./auth.service";

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

  // @UseGuards(JwtAuthGuard)
//   @Get("profile")
//   async getProfile(@Req() req: Request) {
//     if (!req.user && typeof req.user !== "string") {
//       throw new NotAcceptableException();
//     }

//     const user = await this.authService.getUserByUsername(req.user as string);

//     return user;
//   }
}
