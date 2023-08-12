import { Pagination } from "types/local";

export function paginate(pagination: Pagination) {
  return {
    skip: (pagination.page - 1) * pagination.perPage,
    take: pagination.perPage
  };
}

export function createPagination(
  page?: number | string,
  perPage?: number | string
): { pagination?: Pagination } {
  return [ page, perPage ].every(Boolean)
    ? {
      pagination: {
        page: Number(page),
        perPage: Number(perPage)
      }
    }
    : {};
}
