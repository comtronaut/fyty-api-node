import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateReviewDto, UpdateReviewDto } from "src/model/dto/review.dto";
import { PrismaService } from "src/services/prisma.service";

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  // CRUD
  async createReview(req: CreateReviewDto) {
    try {
      const review = await this.prisma.review.create({ data: req });

      const [ useravatar, reviewscore ] = await Promise.all([
        this.prisma.userAvatar.findFirstOrThrow({
          where: { userId: req.revieweeId, gameId: req.gameId }
        }),
        this.prisma.review.findMany({
          where: { revieweeId: req.revieweeId, gameId: req.gameId }
        })
      ]);

      let nowscore = reviewscore.reduce(
        (acc, score) => acc + Number(score.ratingScore),
        0
      );
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

  // update
  // async update(reviewerId: string, req: UpdateReviewDto) {
  //   try {
  //     const updateRes = await this.reviewModel.update(reviewerId, req);

  //     if (updateRes.affected === 0) {
  //       return new HttpException("", HttpStatus.NO_CONTENT);
  //     }

  //     return await this.reviewModel.findOneOrFail({ where: { id: reviewerId } });
  //   } catch (err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }

  // async deleteReview(reviewId: string) {
  //   try {
  //     const res = await this.reviewModel.delete({ id: reviewId });
  //     if (res.affected === 0) {
  //       return new HttpException("", HttpStatus.NO_CONTENT)
  //     }
  //     console.log(res);
  //     return;
  //   } catch(err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }
}
