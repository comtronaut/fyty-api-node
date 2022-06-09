import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateReviewDto } from "src/model/dto/review.dto";
import { Review } from "src/model/sql-entity/review.entity";
import { User } from "src/model/sql-entity/user.entity";
import { Repository } from "typeorm";
import { isDeepStrictEqual } from "util";
import { UserReviewService } from "../users/user-reviews/user-review.service";

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review) private reviewModel: Repository<Review>,
    @InjectRepository(User) private userModel: Repository<User>,
    private readonly userService: UserReviewService,
  ) { }
  
  // CRUD
  async create(req: CreateReviewDto) {
    try {
      const isSameUser = !isDeepStrictEqual(req.revieweeId, req.reviewerId);
      
      if(isSameUser) {
        throw new Error("two users are the same");
      }      
      const res = await this.reviewModel.save(req);
      this.updateUserRatingScore(req.revieweeId)

      return res;
    }
    catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  async getSelf(user: User) {
    return await this.reviewModel.find({ where: { revieweeId: user.id }});
  }

  async updateUserRatingScore(userId: string) {

    const [ user, reviews ] = await Promise.all([
      this.userModel.findOneOrFail({ where: { id: userId }}),
      this.reviewModel.find({ where: { revieweeId: userId }}),
    ]);

    const sumScore = reviews.reduce((acc, cur) => acc + cur.ratingScore, 0);
    let ratingScore = sumScore / reviews.length;

    if(ratingScore > 5) {
      ratingScore = 5.00
    }
    else if(ratingScore < 0) {
      ratingScore = 0.00
    }
    
    return this.userService.updateRatingScore(user, { ratingScore })
  }

  // async delete(gameId: string) {
  //   try {
  //     const res = await this.gameModel.delete(gameId);
  //     if(res.affected === 0) {
  //       return new HttpException("", HttpStatus.NO_CONTENT)
  //     }
  //     return;
  //   } catch (err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }
}
