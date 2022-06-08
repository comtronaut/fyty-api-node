import { Module } from "@nestjs/common";
import { GameModule } from "./games/game.module";
import { UserModule } from "./users/user.module";

@Module({
  imports: [
    UserModule,
    GameModule,
  ],
  controllers: [],
  providers: []
})
export class ApiModule { }
