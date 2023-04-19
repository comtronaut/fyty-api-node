import type { User } from "@prisma/client";

export type Pagination = {
  /**
   * This parameter specifies the current page number that the user is on.
   * The default value is usually 1, but the user can change this to access other pages.
   */
  page: number;
  /**
   * This parameter specifies the number of items to be returned per page.
   * The default value is usually 20, but the user can change this to access more or fewer items.
   */
  perPage: number;
};

export type SecuredUser = Omit<User, "password">;

export type AppointmentStatus = "UPCOMING" | "ONGOING";
