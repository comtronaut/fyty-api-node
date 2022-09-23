import { Controller } from "@nestjs/common";
import { TeamService } from "../team.service";
import { MatchHistortService } from "./matchHistory.service";
import { TeamStatisticService } from "./statistic.service";


@Controller("api/teams")
export class StatisticController {
  constructor(
    private readonly matchService: MatchHistortService,
    private readonly statisticService: TeamStatisticService
  ) { }

    // statistic

    

  
}
