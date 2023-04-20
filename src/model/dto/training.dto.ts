import { PartialType } from "@nestjs/mapped-types";
import { TrainingStatus, Prisma } from "@prisma/client";
import { IsArray, IsBoolean, IsEnum, IsISO8601, IsInt, IsNotEmpty, IsOptional, IsUUID, IsUrl } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreateTrainingDto implements Prisma.TrainingUncheckedCreateInput {
    @IsNotEmpty()
    @IsUUID()
    appointmentId: string

    @IsOptional()
    @IsUUID()
    hostId: string

    @IsOptional()
    @IsUUID()
    guestId: string

    @IsOptional()
    @IsInt()
    hostWinCount: number

    @IsOptional()
    @IsInt()
    hostLoseCount: number

    @IsNotEmpty()
    note: string
    
    @IsOptional()
    @IsEnum(TrainingStatus)
    status: TrainingStatus;

    @IsNotEmpty()
    @IsUrl()
    @IsArray()
    imageUrls: String[]

    @IsNotEmpty()
    @IsBoolean()
    isSubmitted: boolean

    @IsOptional()
    @IsISO8601()
    updatedAt: Date

    @IsOptional()
    @IsISO8601()
    createdAt: Date
}

export class UpdateTrainingDto extends PartialType(CreateTrainingDto) {
    @IsNotEmpty()
    @IsUUID()
    id: string
}

export const schemas = validationMetadatasToSchemas();