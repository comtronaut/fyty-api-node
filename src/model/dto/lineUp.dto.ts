import { PartialType } from "@nestjs/mapped-types";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsUrl, IsUUID } from "class-validator";

export class CreateLineUpDto {

    @IsUUID()
    teamId: string;

    @ApiPropertyOptional()
    isDefault: any;

    @ApiPropertyOptional()
    inGameId: string;

    @ApiPropertyOptional()
    imageUrl: string;

}

export class UpdateLineUpDto extends PartialType(CreateLineUpDto) { }