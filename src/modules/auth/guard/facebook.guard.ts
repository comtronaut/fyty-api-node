import { Injectable } from "@nestjs/common";
import { ExecutionContext } from "@nestjs/common/interfaces";
import { AuthGuard } from "@nestjs/passport";
import axios from "axios";
import { Request } from "express";
import env from "src/common/env.config";
import { config } from "../common";

export type FacebookInfo = {
  id: string;
  name: string;
  email?: string;
  picture: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: string;
    };
  };
};

@Injectable()
export class FacebookAuthGuard extends AuthGuard("facebook") {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const query = req.query;

    const { data: tokenData } = await axios.get(
      "https://graph.facebook.com/v16.0/oauth/access_token",
      {
        params: {
          code: query.code,
          // "code_verifier": query.code_verifier,
          client_id: env.FACEBOOK_CLIENT_ID,
          client_secret: env.FACEBOOK_CLIENT_SECRET,
          redirect_uri: env.FACEBOOK_REDIRECT_URI
        },
        ...config
      }
    );

    const { data: userInfo } = await axios.get(
      "https://graph.facebook.com/me",
      {
        params: {
          fields: [ "id", "name", "email", "picture" ].join(","),
          access_token: tokenData.access_token
        },
        ...config
      }
    );

    req.user = userInfo;

    return true;
  }
}
