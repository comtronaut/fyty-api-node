import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateReviewDto, UpdateReviewDto } from "src/model/dto/review.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(data: CreateReviewDto) {
    try {
      const review = await this.prisma.review.create({ data });

      const [ useravatar, reviewscore ] = await Promise.all([
        this.prisma.userAvatar.findFirstOrThrow({
          where: { userId: data.revieweeId, gameId: data.gameId }
        }),
        this.prisma.review.findMany({
          where: { revieweeId: data.revieweeId, gameId: data.gameId }
        })
      ]);

      let nowscore = reviewscore.reduce((acc, score) => acc + Number(score.ratingScore), 0);
      nowscore = nowscore / reviewscore.length;

      await this.prisma.userAvatar.update({
        where: {
          id: useravatar.id
        },
        data: {
          ratingScore: nowscore
        }
      });

      return review;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getReviewFilter(filter: UpdateReviewDto) {
    return await this.prisma.review.findMany({ where: { ...filter } });
  }

  async getReviewById(id: string) {
    return await this.prisma.review.findMany({ where: { id } });
  }
}
