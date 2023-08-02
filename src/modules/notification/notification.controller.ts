import { Body, Controller, Param, Put } from "@nestjs/common";

import {
  NotifUserRoomRegistrationDto,
  UpdateNotifUserRoomRegistrationDto
} from "model/dto/notif-user-room-registration.dto";
import { NotificationDto, UpdateNotificationDto } from "model/dto/notification.dto";

import { NotificationService } from "./notification.service";

@Controller("notifications")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Put(":id")
  async putNotificationById(
    @Param("id") id: string,
    @Body() payload: UpdateNotificationDto
  ): Promise<NotificationDto> {
    return await this.notificationService.updateNotificationById(id, payload);
  }

  @Put("room-registrations/:id")
  async putRoomRegistrationById(
    @Param("id") id: string,
    @Body() payload: UpdateNotifUserRoomRegistrationDto
  ): Promise<NotifUserRoomRegistrationDto> {
    return await this.notificationService.updateNotifUserRoomRegistrationById(id, payload);
  }
}
