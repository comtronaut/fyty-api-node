import { Controller, Get, HttpStatus, NotAcceptableException, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
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

  @Get("/user/google")
  @UseGuards(AuthGuard("google"))
  async getUser(@Req() req: Request) {
    if (!req.user) {
      return {
        message: "no user from google"
      };
    }

    // ok try to imprement functions on AuthService and use them here

    const res = await this.authService.getUserByOAuth(req.user);

    return res;
  }

  @Get("/user/facebook")
  @UseGuards(AuthGuard("facebook"))
  async facebookLoginRedirect(@Req() req: any): Promise<any> {
    if (!req.user) {
      return {
        message: "no user from facebook"
      };
    }
    // yes, this shit too it's can be the same function i guess

    // const res = await this.authService.getUserByOAuth(req.user as Response.OAuthResult);

    // return res;
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
