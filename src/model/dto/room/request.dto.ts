import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsUrl, IsUUID } from "class-validator";

export class CreateRoomRequestDto {

    @IsNotEmpty()
    @IsUUID()
    teamId: string;

    @IsNotEmpty()
    participantIds: [string];

}