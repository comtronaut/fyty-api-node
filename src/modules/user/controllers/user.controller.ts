import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from "@nestjs/common";
import { ApiNoContentResponse, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

import {
  CreateUserAvatarDto,
  UpdateUserAvatarDto,
  UserAvatarDto
} from "model/dto/user-avatar.dto";
import {
  CreateUserDto,
  SecureUserDto,
  UserDetailResponseDto,
  UserValidationResponseDto
} from "model/dto/user.dto";
import { UserJwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";

import { UserAvatarService } from "../services/avatar.service";
import { UserService } from "../services/user.service";

@Controller("users")
@ApiTags("Users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly avatarService: UserAvatarService
  ) {}

  @Post()
  @ApiResponse({ type: SecureUserDto })
  async addUser(@Body() user: CreateUserDto): Promise<SecureUserDto> {
    return await this.userService.create(user);
  }

  @Get("validation")
  @ApiQuery({ name: "username", required: false })
  @ApiQuery({ name: "mobilePhone", required: false })
  @ApiQuery({ name: "email", required: false })
  @ApiResponse({ type: UserValidationResponseDto })
  async getUserDedup(
    @Query("username") username?: string,
    @Query("mobilePhone") mobilePhone?: string,
    @Query("email") email?: string
  ): Promise<UserValidationResponseDto> {
    return await this.userService.getDuplicationResult({
      username,
      email,
      mobilePhone
    });
  }

  @Get()
  @UseGuards(UserJwtAuthGuard)
  @ApiQuery({ name: "q", required: true })
  @ApiQuery({ name: "teamId", required: false })
  @ApiResponse({ type: [ SecureUserDto ] })
  async getUsersBySearching(
    @Query("q") q: string,
    @Query("teamId") teamId?: string
  ): Promise<SecureUserDto[]> {
    return await this.userService.searchUsers(q, teamId);
  }

  @Get(":id")
  @UseGuards(UserJwtAuthGuard)
  @ApiResponse({ type: SecureUserDto })
  async getUserById(@Param("id") userId: string): Promise<SecureUserDto> {
    return await this.userService.getById(userId);
  }

  @Get(":id/detail")
  @UseGuards(UserJwtAuthGuard)
  @ApiResponse({ schema: UserDetailResponseDto.toSchemaObject() })
  async getUserDetailById(@Param("id") userId: string): Promise<UserDetailResponseDto> {
    return await this.userService.getDetailById(userId);
  }

  // multiple
  @Get("multiple/:ids")
  @UseGuards(UserJwtAuthGuard)
  @ApiResponse({ type: [ SecureUserDto ] })
  async getMultipleUsersByIds(@Param("ids") ids: string): Promise<SecureUserDto[]> {
    return await this.userService.getByIds(ids.split(","));
  }

  // avatars
  @Post("avatars")
  @UseGuards(UserJwtAuthGuard)
  @ApiResponse({ type: UserAvatarDto })
  async postUserAvatar(@Body() payload: CreateUserAvatarDto): Promise<UserAvatarDto> {
    return await this.avatarService.create(payload);
  }

  @Get(":id/avatars")
  @UseGuards(UserJwtAuthGuard)
  @ApiResponse({ type: [ UserAvatarDto ] })
  async getUserAvatarsByUserId(
    @Param("id") userId: string,
    @Query("gameId") gameId?: string
  ): Promise<UserAvatarDto[]> {
    return await this.avatarService.getFilter(userId, gameId);
  }

  @Put("avatars/:id")
  @UseGuards(UserJwtAuthGuard)
  @ApiResponse({ type: UserAvatarDto })
  async putUserAvatarById(
    @Param("id") avatarId: string,
    @Body() payload: UpdateUserAvatarDto
  ): Promise<UserAvatarDto> {
    return await this.avatarService.update(avatarId, payload);
  }

  @Delete("avatars/:id")
  @UseGuards(UserJwtAuthGuard)
  @ApiNoContentResponse()
  async deleteUserAvatarById(@Param("id") avatarId: string): Promise<void> {
    return await this.avatarService.delete(avatarId);
  }
}
