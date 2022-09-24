import { IsEnum, IsNotEmpty, IsUrl, IsUUID } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { ApiPropertyOptional } from "@nestjs/swagger";

// game history

export class CreateGameHistoryDto {

    @IsUUID()
    matchHistoryId: string;

    @IsNotEmpty()
    gameNum: number;

    @IsUrl()
    imgUrl: string;

}

export class UpdateGameHistoryDto { 

    @IsUUID()
    teamId: string

    @ApiPropertyOptional()
    gameNum: number;

    @ApiPropertyOptional()
    imgUrl: string;
}

export enum Uploader{
    HOST,
    GUEST,
    NONE
}

export enum Result{
    WIN,
    LOSE,
    TIE
}

export class UpdateMatchHistoryDto { 

    @ApiPropertyOptional()
    hostWin: number;

    @ApiPropertyOptional()
    hostlose: number;

    @ApiPropertyOptional()
    @IsEnum(Result)
    result: string;

    @ApiPropertyOptional()
    @IsEnum(Uploader)
    uploader: string;
}






