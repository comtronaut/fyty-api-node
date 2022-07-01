import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-facebook";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
  constructor() {
    super({
      clientID: "327208906123145",                         // need to change
      clientSecret: "8598db27bae5da694dbe506dc6b3750e",    // this too
      callbackURL: "https://comafyty.herokuapp.com/login", // yes, of course; so use localhost:xxxx for test
      scope: "email",
      profileFields: [ "name", "photos", "emails" ]
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: (err: any, user: any, info?: any) => void): Promise<any> {
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
