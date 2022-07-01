import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    super({
      clientID: "104576599206-ibbgib9d0jeddhdjecqflr7bcelkm0pc.apps.googleusercontent.com", // yes same as facebook
      clientSecret: "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",                                  // 
      callbackURL: "https://comafyty.herokuapp.com/login",                                  //
      scope: [ "email", "profile" ]
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      Name: name,
      picture: photos[0].value,
      accessToken
    };
    done(null, user);
  }
}
