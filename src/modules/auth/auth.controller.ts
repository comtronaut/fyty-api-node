import {
  Controller,
  Get,
  Query,
  Res,
  UnauthorizedException,
  UseGuards
} from "@nestjs/common";
import { ApiFoundResponse, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";

import env from "common/env.config";
import { UserSubject } from "common/subject.decorator";
import { SecureAdminDto } from "model/dto/admin.dto";
import { AccessTokenDto, OAuthQueryDto } from "model/dto/auth.dto";

import { AuthService } from "./auth.service";
import { FacebookAuthGuard, FacebookInfo } from "./guard/facebook.guard";
import { GoogleAuthGuard, GoogleInfo } from "./guard/google.guard";

@Controller("auth")
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("login")
  @ApiResponse({ type: AccessTokenDto })
  async loginUser(
    @Query("username") username: string,
    @Query("password") password: string
  ): Promise<AccessTokenDto> {
    return await this.authService.loginLocal(username, password);
  }

  @Get("admin/login")
  @ApiResponse({ type: AccessTokenDto })
  async loginAdmin(
    @Query("email") email: string,
    @Query("password") password: string
  ): Promise<AccessTokenDto & SecureAdminDto> {
    return await this.authService.adminLogin(email, password);
  }

  @Get("user/google")
  @UseGuards(GoogleAuthGuard)
  async getGoogleUser(@UserSubject() user: GoogleInfo) {
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
  @ApiQuery({ name: "state", required: false, type: String })
  @ApiQuery({ name: "code_challenge", required: false, type: String })
  @ApiQuery({ name: "code_challenge_method", required: false, type: String })
  @ApiQuery({ name: "nonce", required: false, type: String })
  @ApiFoundResponse()
  async redirectToGoogle(@Res() res: Response, @Query() query: OAuthQueryDto) {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: env.GOOGLE_CLIENT_ID,
      redirect_uri: env.GOOGLE_REDIRECT_URI,
      scope: [ "openid", "profile", "email" ].join(" "),
      ...query
    });
    const url = `https://accounts.google.com/o/oauth2/v2/auth?${String(params)}`;

    return res.redirect(url);
  }

  @Get("facebook")
  @ApiQuery({ name: "state", required: false, type: String })
  @ApiQuery({ name: "code_challenge", required: false, type: String })
  @ApiQuery({ name: "code_challenge_method", required: false, type: String })
  @ApiQuery({ name: "nonce", required: false, type: String })
  @ApiFoundResponse()
  async redirectToFacebook(@Res() res: Response, @Query() query: OAuthQueryDto) {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: env.FACEBOOK_CLIENT_ID,
      redirect_uri: env.FACEBOOK_REDIRECT_URI,
      scope: [ "public_profile", "email" ].join(" "),
      ...query
    });
    const url = `https://www.facebook.com/v16.0/dialog/oauth?${String(params)}`;

    return res.redirect(url);
  }
}
