import { IsNotEmpty, IsUrl, IsUUID } from "class-validator";
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

    @ApiPropertyOptional()
    gameNum: number;

    @ApiPropertyOptional()
    imgUrl: string;
}

export class UpdateMatchHistoryDto { 

    @ApiPropertyOptional()
    hostWin: number;

    @ApiPropertyOptional()
    hostlose: number;

    @ApiPropertyOptional()
    result: string;

    @ApiPropertyOptional()
    uploader: string;
}

