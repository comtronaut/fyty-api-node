import { Injectable } from "@nestjs/common";

import { User } from "@prisma/client";
import { UpdateUserDto } from "src/model/dto/user.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async updateRatingScore(user: User, data: UpdateUserDto) {
    const updateRes = await this.prisma.user.update({
      where: { id: user.id },
      data
    });

    const { password, ...res } = await this.prisma.user.findUniqueOrThrow({
      where: { id: user.id }
    });

    return res;
  }
}
