import { BadRequestException, Body, Controller, Param, Put } from "@nestjs/common";

import { NotifUserRoomRegistrationDto } from "model/dto/notif-user-room-registration.dto";
import { NotificationDto, UpdateNotificationDto } from "model/dto/notification.dto";

import { NotificationService } from "./notification.service";

@Controller("notifications")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Put(":id/mark-as-read")
  async markAsReadNotificationById(@Param("id") id: string): Promise<NotificationDto> {
    return await this.notificationService.markAsReadNotificationById(id);
  }

  @Put(":id/action")
  async putResponseOnNotificationById(
    @Param("id") id: string,
    @Body() payload: UpdateNotificationDto
  ): Promise<NotificationDto> {
    if (!payload.response) {
      throw new BadRequestException("response cannot be omitted or null value");
    }

    return await this.notificationService.performActionNotificationById(
      id,
      payload.response
    );
  }

  @Put("room-registrations/:id/mark-as-read")
  async markAsReadRoomRegistrationById(
    @Param("id") id: string
  ): Promise<NotifUserRoomRegistrationDto> {
    return await this.notificationService.markAsReadNotifUserRoomRegistrationById(id);
  }
}
