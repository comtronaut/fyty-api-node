import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class UserJwtAuthGuard extends AuthGuard("jwt-user") {}

@Injectable()
export class AdminJwtAuthGuard extends AuthGuard("jwt-admin") {}
