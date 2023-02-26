import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-facebook";
import { Injectable } from "@nestjs/common";
import env from "src/common/env.config";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
  constructor() {
    super({
      clientID: env.FACEBOOK_CLIENT_ID, // need to change
      clientSecret: env.FACEBOOK_CLIENT_SECRET, // this too
      callbackURL: env.FACEBOOK_REDIRECT_URI, // yes, of course; so use localhost:xxxx for test
      scope: "email",
      profileFields: [ "name", "photos", "emails" ]
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user: any, info?: any) => void
  ): Promise<any> {
    const { name, photos, emails } = profile;
    const user = {
      email: emails[0].value,
      Name: name,
      picture: photos[0].value,
      accessToken
    };
    done(null, user);
  }
}
