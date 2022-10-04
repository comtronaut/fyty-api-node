import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    super({
      clientID: "104576599206-2vtuoc5d1ua4vq1a40j46s1qljdv4pj0.apps.googleusercontent.com", 
      clientSecret: "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",                                  
      callbackURL: "http://fyty-esport.com/login",                                  
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
