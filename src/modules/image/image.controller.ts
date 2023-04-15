import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Debug } from "src/common/debug.decorator";
import { ImageService } from "./image.service";

@Controller("images")
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  @Debug()
  async __getAll() {
    return await this.imageService.__getAllImageUrls();
  }

  @Post("blob")
  // @UseGuards(UserJwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  async uploadFileBlob(@UploadedFile() file: any) {
    const res = await this.imageService.uploadImageBlob(file);

    return { url: res };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteImage(@Param("id") id: string) {
    return await this.imageService.deleteImageById(id);
  }
}
