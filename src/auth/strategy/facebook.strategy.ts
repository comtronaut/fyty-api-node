import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-facebook";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
  constructor() {
    super({
      clientID: "633711121656488", // need to change
      clientSecret: "7eb0bdd030f31c027c027f818abb4be6", // this too
      callbackURL: "https://fyty-esport.com/login", // yes, of course; so use localhost:xxxx for test
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
