import {
  Controller,
  Get,
  Query,
  Res,
  UnauthorizedException,
  UseGuards
} from "@nestjs/common";
import env from "common/env.config";
import { UserSubject } from "common/subject.decorator";
import { Response } from "express";
import { LoginAdminQueryDto, LoginUserQueryDto, OAuthQueryDto } from "model/dto/auth.dto";
import URI from "urijs";
import { AuthService } from "./auth.service";
import { FacebookAuthGuard, FacebookInfo } from "./guard/facebook.guard";
import { GoogleAuthGuard, GoogleInfo } from "./guard/google.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("login")
  async login(@Query() query: LoginUserQueryDto) {
    const { username, password } = query;
    return await this.authService.loginLocal(username, password);
  }

  @Get("admin/login")
  async adminLogin(@Query() query: LoginAdminQueryDto) {
    const { email, password } = query;
    return await this.authService.adminLogin(email, password);
  }

  @Get("user/google")
  @UseGuards(GoogleAuthGuard)
  async getUser(@UserSubject() user: GoogleInfo) {
    if (!user) {
      throw new UnauthorizedException();
    }

    return await this.authService.loginGoogle(user);
  }

  @Get("user/facebook")
  @UseGuards(FacebookAuthGuard)
  async facebookLoginRedirect(@UserSubject() user: FacebookInfo) {
    if (!user) {
      throw new UnauthorizedException();
    }

    return await this.authService.loginFacebook(user);
  }

  @Get("google")
  async redirectToGoogle(@Res() res: Response, @Query() query: OAuthQueryDto) {
    const url = URI("https://accounts.google.com/o/oauth2/v2/auth")
      .query({
        response_type: "code",
        client_id: env.GOOGLE_CLIENT_ID,
        redirect_uri: env.GOOGLE_REDIRECT_URI,
        scope: [ "openid", "profile", "email" ].join(" "),
        ...query
      })
      .href();

    return res.redirect(url);
  }

  @Get("facebook")
  async redirectToFacebook(@Res() res: Response, @Query() query: OAuthQueryDto) {
    const url = URI("https://www.facebook.com/v16.0/dialog/oauth")
      .query({
        response_type: "code",
        client_id: env.FACEBOOK_CLIENT_ID,
        redirect_uri: env.FACEBOOK_REDIRECT_URI,
        scope: [ "public_profile", "email" ].join(" "),
        ...query
      })
      .href();

    return res.redirect(url);
  }
}
