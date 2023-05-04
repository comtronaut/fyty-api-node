import { Injectable } from "@nestjs/common";
import { ExecutionContext } from "@nestjs/common/interfaces";
import { AuthGuard } from "@nestjs/passport";
import axios from "axios";
import { Request } from "express";
import env from "common/env.config";
import { config } from "../common";

export type GoogleInfo = {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email?: string;
  email_verified: string;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  locale: string;
  iat: string;
  exp: string;
  alg: string;
  kid: string;
  typ: string;
};

@Injectable()
export class GoogleAuthGuard extends AuthGuard("google") {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const query = req.query;

    const { data: tokenData } = await axios.postForm(
      "https://oauth2.googleapis.com/token",
      {
        code: query["code"],
        // "code_verifier": query.code_verifier,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code"
      },
      config
    );

    const { data: userInfo } = await axios.get("https://oauth2.googleapis.com/tokeninfo", {
      params: {
        id_token: tokenData.id_token
      },
      ...config
    });

    req.user = userInfo;

    return true;
  }
}
