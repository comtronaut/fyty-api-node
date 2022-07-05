import { PartialType } from "@nestjs/mapped-types";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsUrl, IsUUID } from "class-validator";

export class CreateLineUpDto {

    @ApiPropertyOptional()
    @IsUUID()
    teamId: string;

    @IsNotEmpty()
    inGameId: string;

    @ApiPropertyOptional()
    @IsUrl()
    imageUrl: string;

}

export class UpdateLineUpDto extends PartialType(CreateLineUpDto) { }