import { Zodios } from "@zodios/core";
import { config } from "core/config";
import adminadmins from "./modules/admin-admins";
import adminappointments from "./modules/admin-appointments";
import admingames from "./modules/admin-games";
import adminreports from "./modules/admin-reports";
import adminrooms from "./modules/admin-rooms";
import adminteams from "./modules/admin-teams";
import admintrainings from "./modules/admin-trainings";
import adminusers from "./modules/admin-users";
import appointment from "./modules/appointment";
import auth from "./modules/auth";
import chat from "./modules/chat";
import game from "./modules/game";
import me from "./modules/me";
import callback from "./modules/callback";
import lineNotify from "./modules/lineNotify";
import review from "./modules/review";
import room from "./modules/room";
import passwordresetsessions from "./modules/password-reset-sessions";
import lineup from "./modules/lineup";
import team from "./modules/team";
import user from "./modules/user";

export const coreApi = new Zodios(
  config.coreApiOrigin,
  [
    ...adminadmins,
    ...adminappointments,
    ...admingames,
    ...adminreports,
    ...adminrooms,
    ...adminteams,
    ...admintrainings,
    ...adminusers,
    ...appointment,
    ...auth,
    ...chat,
    ...game,
    ...me,
    ...callback,
    ...lineNotify,
    ...review,
    ...room,
    ...passwordresetsessions,
    ...lineup,
    ...team,
    ...user
  ],
  {
    axiosConfig: {
      headers: {
        "Content-Type": "application/json"
      }
    }
  }
);
