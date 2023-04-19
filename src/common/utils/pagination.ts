import { Pagination } from "src/types/local";

export function paginate(pagination: Pagination) {
  return {
    skip: (pagination.page - 1) * pagination.perPage,
    take: pagination.perPage
  };
}
