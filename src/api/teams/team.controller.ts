import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { Debug } from "src/common/debug.decorator";
import { TeamService } from "./team.service";
import { CreateTeamDto, UpdateTeamDto, UpdateTeamMemberDto } from "src/model/dto/team.dto";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { Subject } from "src/common/subject.decorator";
import { User } from "src/model/sql-entity/user.entity";
import { TeamMemberService } from "./members/team-member.service";

@Controller("api/teams")
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async creteTeam(
    @Subject() user: User,
    @Body() req: CreateTeamDto,
    ) {
    return this.teamService.create(user, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTeamsByGameId(
    @Param("gameId") gameId: string) {
    if(gameId){
      return this.teamService.getTeamsByGameId(gameId);
    }
    return this.teamService.getAllTeam();
    
  }

  @UseGuards(JwtAuthGuard)
  @Get(":teamId")
  async getMembersByTeamId(
    @Param("teamId") teamId: string) {
    return this.teamService.getTeam(teamId);
  }


  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async updateTeam(
    @Subject() user: User, 
    @Body() req: UpdateTeamDto,
    ) {
    return await this.teamService.update(user.id, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/:id")
  async delateTeam(
    @Subject() user: User,
    @Param("teamId") teamId: string  
    ) {
    
    return await this.teamService.delete(user.id, teamId);
  }

  
  // @Put("/members")
  // async promoteOrDemoteMember(@Body() req: UpdateTeamMemberDto) {
  //   return this.memberService.promoteOrDemoteMember(req);
  //   }

  // @Delete("/members/")
  // async kickMember(@Body() req: UpdateTeamMemberDto) {
  //   return this.memberService.kickMember(req);
  // }

  // @Debug()
  // @Delete("/:gameId")
  // async deleteUser(@Param("gameId") gameId: string) {    
  //   return await this.teamService.delete(gameId);
  // }
}
