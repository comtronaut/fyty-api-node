import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Double, Repository } from "typeorm";
import { Review } from "src/model/sql-entity/user/review.entity";
import { User } from "src/model/sql-entity/user/user.entity";
import { UserAvatar } from "src/model/sql-entity/user/userAvatar.entity";
import { CreateReviewDto, UpdateReviewDto } from "src/model/dto/review.dto";
import { UserAvatarService } from "../users/user-avatars/avatar.service";

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review) private reviewModel: Repository<Review>,
    @InjectRepository(UserAvatar) private avatarModel: Repository<UserAvatar>,
    private readonly avatarService: UserAvatarService,
  ) { }
  
  // CRUD
  async createReview( req : CreateReviewDto) {
    try {
      const review=await this.reviewModel.save(req);
      const [useravatar,reviewscore] = await Promise.all([
        this.avatarModel.findOneOrFail({where:{userId:req.revieweeId,gameId:req.gameId}}),
        this.reviewModel.findAndCount({where:{revieweeId:req.revieweeId,gameId:req.gameId}})
      ])
      let count = reviewscore[1];
      let nowscore = 0;
      // console.log(count);
      // console.log(nowscore);
      reviewscore[0].map((score)=>{
        nowscore=nowscore+Number(score.ratingScore);
        // console.log(nowscore);
      })
      nowscore=nowscore/count;
      useravatar.ratingScore=nowscore;
      this.avatarService.update(useravatar.id,useravatar);
      console.log(useravatar);
      return review;
    }
    catch(err) {
      throw new BadRequestException(err.message);
    }
  }
  
  async getReviewFilter(filter: UpdateReviewDto) {
    return await this.reviewModel.find({where:{ ...filter }});
  }

  async getReviewById(id: string) {
    return await this.reviewModel.find({where:{ id }});
  }


  //update
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
