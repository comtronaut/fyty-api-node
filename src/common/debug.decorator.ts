import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UseGuards,
  applyDecorators
} from "@nestjs/common";
import { Observable } from "rxjs";

import env from "./env.config";

@Injectable()
class DebugGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return env.NODE_ENV === "development";
  }
}

export function Debug() {
  return applyDecorators(UseGuards(DebugGuard));
}
