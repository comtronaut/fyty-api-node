import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsUrl, IsUUID } from "class-validator";

export class CreateParticipantDto {

    @IsNotEmpty()
    @IsUUID()
    teamId: string;

    @IsNotEmpty()
    @IsUUID()
    roomId: string;

    @IsNotEmpty()
    @IsUUID()
    gameId: string;

}