import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsUrl, IsUUID } from "class-validator";

export class CreateLineUpDto {

    @IsNotEmpty()
    @IsUUID()
    teamId: string;

    @IsNotEmpty()
    inGameId: string;

    @IsNotEmpty()
    @IsUrl()
    imgUrl: string;

}

export class UpdateLineUpDto extends PartialType(CreateLineUpDto) { }